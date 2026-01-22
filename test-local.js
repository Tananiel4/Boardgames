
async function run() {
    try {
        console.log("Fetching local API...");
        const res = await fetch("http://localhost:3001/api/games?query=Catan");
        console.log("Status:", res.status);
        if (!res.ok) {
            const text = await res.text();
            console.log("Error Body:", text);
            return;
        }
        const data = await res.json();
        console.log("Games Found:", data.games?.length);
        if (data.games?.length > 0) {
            console.log("First Game:", data.games[0].name, "|", data.games[0].description.substring(0, 50));
        }
    } catch (e) {
        console.error("Error:", e);
    }
}
run();
