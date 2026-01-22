export const CATEGORY_MAP: Record<string, string | null> = {
    "Strategiczne": "strategygames_rank",
    "Rodzinne": "familygames_rank",
    "Imprezowe": "partygames_rank",
    "Kooperacyjne": null, // Not a ranked list, requires mechanic filter
    "Ekonomiczne": "strategygames_rank", // Fallback to strategy? Or null? Let's use Strategy for now as approximation
    "Przygodowe": "thematic_rank",
    "Karciane": null, // No specific rank col
    "Wojenne": "wargames_rank",
    "Abstrakcyjne": "abstracts_rank",
    "Dedukcyjne": null,
    "Dziecięce": "childrensgames_rank"
};

export const categories = Object.keys(CATEGORY_MAP);
