
const { XMLParser } = require("fast-xml-parser");

const BGG_API_TOKEN = "9b63f96a-de64-4005-bd91-7f24af7a4fa6";
const BGG_BASE_URL = "https://boardgamegeek.com/xmlapi2";

const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
});

async function run() {
    try {
        console.log("Starting test...");
        const query = "Catan";

        // 1. Search
        const searchUrl = `${BGG_BASE_URL}/search?query=${encodeURIComponent(query)}&type=boardgame`;
        console.log("Fetching:", searchUrl);

        const searchResponse = await fetch(searchUrl, {
            headers: { Authorization: `Bearer ${BGG_API_TOKEN}` }
        });

        if (!searchResponse.ok) {
            console.error("Search failed:", searchResponse.status, searchResponse.statusText);
            const text = await searchResponse.text();
            console.error("Body:", text);
            return;
        }

        const searchXml = await searchResponse.text();
        console.log("Search XML length:", searchXml.length);

        const searchResult = parser.parse(searchXml);
        console.log("Parsed Search:", JSON.stringify(searchResult).substring(0, 200) + "...");

        const items = searchResult.items?.item || [];
        const gamesList = Array.isArray(items) ? items : [items];
        console.log("Found games:", gamesList.length);

        if (gamesList.length === 0) return;

        const topGames = gamesList.slice(0, 2);
        const gameIds = topGames.map(g => g["@_id"]).join(",");
        console.log("Game IDs:", gameIds);

        // 2. Details
        const thingsUrl = `${BGG_BASE_URL}/thing?id=${gameIds}&stats=1`;
        console.log("Fetching Details:", thingsUrl);

        const thingsResponse = await fetch(thingsUrl, {
            headers: { Authorization: `Bearer ${BGG_API_TOKEN}` }
        });

        if (!thingsResponse.ok) {
            console.error("Things failed:", thingsResponse.status);
            return;
        }

        const thingsXml = await thingsResponse.text();
        console.log("Things XML length:", thingsXml.length);
        const thingsResult = parser.parse(thingsXml);

        console.log("Success!");

    } catch (e) {
        console.error("EXCEPTION:", e);
    }
}

run();
