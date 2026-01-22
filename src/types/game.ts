export interface BoardGame {
    id: number;
    name: string;
    description: string;
    minPlayers: number;
    maxPlayers: number;
    minAge: number;
    playTime: string;
    categories: string[];
    rating: number; // or string if you prefer keeping it exactly as in existing data, but number is better
    image: string;
    year: number;
}
