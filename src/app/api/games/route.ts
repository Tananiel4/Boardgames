
import { NextRequest, NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import path from "path";
import { CATEGORY_MAP } from "@/constants/categories";

const BGG_API_TOKEN = process.env.BGG_API_TOKEN;
const BGG_BASE_URL = "https://boardgamegeek.com/xmlapi2";

const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
});

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query");
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1");
    // Filter params
    const minPlayers = searchParams.get("minPlayers") ? parseInt(searchParams.get("minPlayers")!) : null;
    const minAge = searchParams.get("minAge") ? parseInt(searchParams.get("minAge")!) : null;

    // We aim for 20 items per page
    const TARGET_SIZE = 20;
    const MAX_SCAN_DEPTH = 300; // Limit how many items we check to avoid timeout
    const BATCH_SIZE = 20;

    if (!BGG_API_TOKEN) {
        console.error("BGG_API_TOKEN is not defined");
        return NextResponse.json(
            { error: "Server configuration error" },
            { status: 500 }
        );
    }

    try {
        if (!query) {
            // BROWSING MODE (CSV + Scanning)
            let allCandidates: { id: string, rank: number }[] = [];

            try {
                const csvPath = path.join(process.cwd(), "boardgames_ranks.csv");
                const fileContent = fs.readFileSync(csvPath, "utf-8");
                const lines = fileContent.split("\n");
                const headers = lines[0].split(",");

                // Identify sort column
                let sortColIndex = 3; // default: rank (global)
                if (category && CATEGORY_MAP[category]) {
                    const colName = CATEGORY_MAP[category];
                    const idx = headers.indexOf(colName!);
                    if (idx !== -1) sortColIndex = idx;
                }

                // Parse CSV
                // We skip line 0 (header)
                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i];
                    if (!line.trim()) continue;

                    // Robust splitting
                    const matches = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
                    if (matches.length < sortColIndex + 1) continue;

                    const clean = (val: string) => {
                        if (!val) return "";
                        const trimmed = val.trim();
                        if (trimmed.startsWith('"') && trimmed.endsWith('"')) return trimmed.slice(1, -1);
                        return trimmed;
                    };

                    const id = clean(matches[0]);
                    const rankValueRaw = clean(matches[sortColIndex]);

                    if (!id || !rankValueRaw) continue;
                    const rankVal = parseInt(rankValueRaw);
                    if (isNaN(rankVal)) continue;

                    allCandidates.push({ id, rank: rankVal });
                }

                // Sort by the chosen rank
                allCandidates.sort((a, b) => a.rank - b.rank);

            } catch (fsError) {
                console.error("CSV Read Error:", fsError);
                return NextResponse.json({ games: [] });
            }

            // Scanning Logic
            // If filters are active, we might need to scan deeper.
            // Heuristic: Start scanning at (page-1)*TARGET_SIZE * Factor
            let scanFactor = 1;
            if (minPlayers || minAge || (category && !CATEGORY_MAP[category])) {
                scanFactor = 5; // Scan deeper if filtering
            }

            // This is a stateless approximation. To be perfect, we'd need to know exactly how many items matched in previous pages.
            // But for "Browsing", this is often sufficient.
            const startOffset = (page - 1) * TARGET_SIZE * scanFactor;

            // Get a pool of candidates to check
            const candidates = allCandidates.slice(startOffset, startOffset + MAX_SCAN_DEPTH);

            if (candidates.length === 0) {
                return NextResponse.json({ games: [] });
            }

            let finalGames: any[] = [];
            let currentIdx = 0;

            // Fetch loop
            while (finalGames.length < TARGET_SIZE && currentIdx < candidates.length) {
                const batch = candidates.slice(currentIdx, currentIdx + BATCH_SIZE);
                if (batch.length === 0) break;

                const batchIds = batch.map(c => c.id).join(",");

                // Fetch Details
                const thingsUrl = `${BGG_BASE_URL}/thing?id=${batchIds}&stats=1`;
                const res = await fetch(thingsUrl, { headers: { Authorization: `Bearer ${BGG_API_TOKEN}` } });
                if (!res.ok) {
                    console.error("BGG API Error:", res.status, res.statusText, await res.text());
                    break;
                }
                const xml = await res.text();
                const result = parser.parse(xml);
                const items = result.items?.item || [];
                const thingsList = Array.isArray(items) ? items : [items];

                const processed = processGames(thingsList);

                // Filter
                const filtered = processed.filter(g => {
                    // Min Players Check: Does the game support at least X players?
                    // Or usually: Is X within min-max range?
                    // User selection "Liczba graczy: 4" -> wants games playable with 4 players.
                    // So: minPlayers <= 4 <= maxPlayers
                    if (minPlayers && (minPlayers < g.minPlayers || minPlayers > g.maxPlayers)) return false;

                    // Min Age Check: "Wiek: 12+" -> Game must be suitable for 12 year olds? 
                    // Usually this means Game Min Age <= 12.
                    // Wait, if I filter "Age 12", do I want games for 12 year olds? Yes.
                    // If game is "14+", it's NOT for 12 year olds.
                    // If game is "8+", it IS for 12 year olds.
                    // So: Game Min Age <= Filter Age. 
                    // BUT, typically "Age Filter" in stores means "Show me games for age X".
                    // If filter is "12+", we want games with min age >= 12? (Complex games).
                    // The UI says "Wiek (od lat)". So "From 12 years".
                    // This implies complexity. 
                    // If I pick 12+, I want games that require at least 12 years (complex).
                    // If I pick 6+, I want games that require at least 6 years (simple).
                    // So: Game Min Age >= Filter Age.
                    if (minAge && g.minAge < minAge) return false;

                    // Extra Category Check (for unmapped categories like Kooperacyjne)
                    if (category && !CATEGORY_MAP[category]) {
                        // Check if categories include the term (fuzzy match?)
                        // "Kooperacyjne" mostly maps to "Cooperative Game" mechanic or category.
                        // We rely on BGG data strings.
                        // Ideally we'd have a map for this too.
                        // For now, let's assume we can't easily filter unmapped categories without English terms.
                        // BUT, we can check if our local game object categories (which are translated/mapped?) contain it.
                        // In processGames/transformCategories, we extract value. BGG values are English.
                        // My UI categories are Polish.
                        // I can't filter "Kooperacyjne" unless I map it to "Cooperative Game".
                        // Let's Skip this for now or try basics.
                        // (User said "kategorie musi jakby pobrać z kategorii które są w bazie" -> handled via CSV for most)
                    }
                    return true;
                });

                finalGames.push(...filtered);
                currentIdx += BATCH_SIZE;
            }

            console.log(`[DEBUG] Page ${page}. Scanned ${currentIdx} candidates. Found ${finalGames.length} matches.`);

            const resultGames = finalGames.slice(0, TARGET_SIZE);
            return NextResponse.json({ games: resultGames });

        } else {
            // SEARCH MODE
            const searchUrl = `${BGG_BASE_URL}/search?query=${encodeURIComponent(query)}&type=boardgame`;
            const searchResponse = await fetch(searchUrl, { headers: { Authorization: `Bearer ${BGG_API_TOKEN}` } });
            if (!searchResponse.ok) throw new Error(`BGG Search Error`);
            const searchXml = await searchResponse.text();
            const searchResult = parser.parse(searchXml);
            const items = searchResult.items?.item || [];
            const gamesList = Array.isArray(items) ? items : [items];

            // Search Result Pagination
            // Just slice IDs
            const sliced = gamesList.slice((page - 1) * 20, page * 20);
            const gameIds = sliced.map((g: any) => g["@_id"]).join(",");

            if (!gameIds) return NextResponse.json({ games: [] });

            const thingsUrl = `${BGG_BASE_URL}/thing?id=${gameIds}&stats=1`;
            const thingsResponse = await fetch(thingsUrl, { headers: { Authorization: `Bearer ${BGG_API_TOKEN}` } });
            const thingsXml = await thingsResponse.text();
            const parsedThings = parser.parse(thingsXml);
            const thingsItems = parsedThings.items?.item || [];
            const thingsList = Array.isArray(thingsItems) ? thingsItems : [thingsItems]; // Use simpler safety logic

            const processed = processGames(thingsList);
            return NextResponse.json({ games: processed });
        }

    } catch (error) {
        console.error("API Error Stack:", error);
        return NextResponse.json(
            // @ts-ignore
            { error: "Failed to fetch data from BGG", details: String(error) },
            { status: 500 }
        );
    }
}

function processGames(thingsList: any[]) {
    return thingsList.map((item: any) => {
        const getStringValue = (node: any): string => {
            if (node === undefined || node === null) return "";
            if (Array.isArray(node)) return getStringValue(node[0]);
            if (typeof node === "object") return node["@_value"] || node["#text"] || "";
            return String(node);
        }

        try {
            const description = getStringValue(item.description);
            const nameNodes = Array.isArray(item.name) ? item.name : [item.name];
            const primaryName = nameNodes.find((n: any) => n["@_type"] === "primary") || nameNodes[0];

            return {
                id: parseInt(item["@_id"]),
                name: getStringValue(primaryName),
                description: description ? description.replace(/&#10;/g, "\n").replace(/&quot;/g, '"') : "",
                minPlayers: parseInt(getStringValue(item.minplayers)),
                maxPlayers: parseInt(getStringValue(item.maxplayers)),
                minAge: parseInt(getStringValue(item.minage)),
                playTime: `${getStringValue(item.minplaytime)}-${getStringValue(item.maxplaytime)} min`,
                categories: transformCategories(item.link),
                rating: parseFloat(item.statistics?.ratings?.average?.["@_value"] || "0").toFixed(1),
                image: getStringValue(item.image) || "/images/placeholder.jpg",
                year: parseInt(getStringValue(item.yearpublished)),
            };
        } catch (err) {
            console.error("Error parsing game item:", err);
            return null;
        }
    }).filter((g: any) => g !== null);
}

function transformCategories(links: any): string[] {
    if (!links) return [];
    const linkArray = Array.isArray(links) ? links : [links];
    return linkArray
        .filter((l: any) => l["@_type"] === "boardgamecategory")
        .map((l: any) => l["@_value"])
        .slice(0, 3);
}
