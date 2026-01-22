"use client";

import { useState, useMemo, useEffect } from "react";
// import { games } from "@/data/games"; // Removing static data
import { BoardGame } from "@/types/game";
import { Filters as FiltersType } from "@/types/filters";
import Filters from "@/components/Filters";
import GameCard from "@/components/GameCard";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiGames, setApiGames] = useState<BoardGame[] | null>(null);

  const [filters, setFilters] = useState<FiltersType>({
    playerCount: null,
    category: null,
    minAge: null,
    searchQuery: "",
  });

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Load games with support for browsing and search
  const loadGames = (reset: boolean = false) => {
    const currentPage = reset ? 1 : page;
    const query = filters.searchQuery.trim();
    const category = filters.category || "";

    setIsLoading(true);

    // Construct URL
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (category) params.set("category", category);
    if (filters.minAge) params.set("minAge", filters.minAge.toString());
    if (filters.playerCount) params.set("minPlayers", filters.playerCount.toString());
    params.set("page", currentPage.toString());

    fetch(`/api/games?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        const newGames = data.games || [];
        if (reset) {
          setApiGames(newGames);
          setPage(2);
        } else {
          setApiGames(prev => [...(prev || []), ...newGames]);
          setPage(prev => prev + 1);
        }
        // If we got fewer than 20 games, we likely exhausted the scan or CSV
        setHasMore(newGames.length === 20);
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  };

  // Initial load
  useEffect(() => {
    loadGames(true);
  }, []); // Only mount

  // Watch filters
  useEffect(() => {
    // Debounce all filter changes
    const handler = setTimeout(() => {
      loadGames(true);
    }, 500);

    return () => clearTimeout(handler);
  }, [filters.searchQuery, filters.category, filters.minAge, filters.playerCount]);

  // Direct backend results (no local filtering)
  const filteredGames = apiGames || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                BoardGame Finder
              </h1>
              <p className="text-sm text-gray-500">
                Znajdz idealna gre planszowa
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <Filters filters={filters} onFiltersChange={setFilters} />

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Szukam w BGG...
              </span>
            ) : filteredGames.length === 0 ? (
              <span>Brak wynikow</span>
            ) : filteredGames.length === 1 ? (
              <span>
                Znaleziono <strong className="text-indigo-600">1</strong> gre
              </span>
            ) : filteredGames.length < 5 ? (
              <span>
                Znaleziono{" "}
                <strong className="text-indigo-600">{filteredGames.length}</strong>{" "}
                gry
              </span>
            ) : (
              <span>
                Znaleziono{" "}
                <strong className="text-indigo-600">{filteredGames.length}</strong>{" "}
                gier
              </span>
            )}
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{apiGames ? "Dane z BoardGameGeek" : "Dane testowe (lokalne)"}</span>
          </div>
        </div>

        {/* Games Grid */}
        {filteredGames.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGames.map((game) => (
              <GameCard key={`${game.id}-${game.name}`} game={game} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredGames.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl p-8 shadow-sm inline-block">
              <svg
                className="w-16 h-16 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-gray-500 text-lg font-medium">Nie znaleziono gier spełniających kryteria.</p>
              <div className="mt-4">
                <button
                  onClick={() => setFilters({
                    playerCount: null,
                    category: null,
                    minAge: null,
                    searchQuery: "",
                  })}
                  className="text-indigo-600 font-medium hover:text-indigo-800"
                >
                  Wyczyść filtry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && !isLoading && filteredGames.length > 0 && (
          <div className="flex justify-center mt-12 mb-8">
            <button
              onClick={() => loadGames(false)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
              </svg>
              Więcej gier
            </button>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center mt-12 mb-8">
            <div className="flex items-center gap-2 text-indigo-600 bg-white px-6 py-3 rounded-full shadow-md">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="font-medium">Ładowanie kolejnych gier...</span>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-gray-500">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
                />
              </svg>
              <span>BoardGame Finder</span>
            </div>
            <p className="text-sm text-gray-400">
              Powered by BoardGameGeek API
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
