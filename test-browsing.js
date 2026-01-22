
async function run() {
    const port = 3005;
    console.log(`Testing on port ${port}...`);

    try {
        console.log("Fetching Page 1 (No Query)...");
        const res1 = await fetch(`http://localhost:${port}/api/games?page=1`);
        const data1 = await res1.json();
        console.log("Page 1 Games:", data1.games?.length);
        if (data1.games?.length > 0) {
            console.log("Top Game:", data1.games[0].name, "ID:", data1.games[0].id);
        }

        console.log("Fetching Page 2 (No Query)...");
        const res2 = await fetch(`http://localhost:${port}/api/games?page=2`);
        const data2 = await res2.json();
        console.log("Page 2 Games:", data2.games?.length);
        if (data2.games?.length > 0) {
            console.log("First Game of Page 2:", data2.games[0].name);
        }

        if (data1.games?.[0]?.id !== data2.games?.[0]?.id) {
            console.log("Pagination appears to work!");
        } else {
            console.log("Pagination failed (same content).");
        }

    } catch (e) {
        console.error("Error:", e);
    }
}
run();
