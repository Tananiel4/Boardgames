
async function run() {
    const port = 3005;
    console.log(`Testing filtering on port ${port}...`);

    try {
        // Test 1: Category Filtering (Strategy)
        console.log("\n--- Test 1: Strategy Games ---");
        const res1 = await fetch(`http://localhost:${port}/api/games?category=Strategiczne&page=1`);
        const data1 = await res1.json();
        console.log(`Returned ${data1.games?.length} Strategy games.`);
        if (data1.games?.length > 0) {
            console.log("Top Strategy Game:", data1.games[0].name);
        }

        // Test 2: Age Filtering (Age 12+)
        // This relies on the scanning loop.
        console.log("\n--- Test 2: Age 12+ (Scanning) ---");
        const start = Date.now();
        const res2 = await fetch(`http://localhost:${port}/api/games?minAge=12&page=1`);
        const data2 = await res2.json();
        const duration = Date.now() - start;
        console.log(`Returned ${data2.games?.length} games in ${duration}ms.`);

        const validAge = data2.games?.every((g) => g.minAge >= 12);
        console.log(`All games minAge >= 12? ${validAge}`);
        if (!validAge) {
            const invalid = data2.games?.find((g) => g.minAge < 12);
            console.log("Invalid example:", invalid?.name, "Age:", invalid?.minAge);
        }

        // Test 3: Combined (Strategy + Age 14+)
        console.log("\n--- Test 3: Strategy + Age 14+ ---");
        const res3 = await fetch(`http://localhost:${port}/api/games?category=Strategiczne&minAge=14&page=1`);
        const data3 = await res3.json();
        console.log(`Returned ${data3.games?.length} games.`);
        if (data3.games?.length > 0) {
            console.log("Top Result:", data3.games[0].name, "Age:", data3.games[0].minAge);
        }

    } catch (e) {
        console.error("Error:", e);
    }
}
run();
