"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define TypeScript interfaces for better type safety
interface SearchResult {
  text: string;
  metadata: Record<string, any>;
}

export default function ResearchAutomation() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]); // Initialize as empty array
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // For error messages

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Reset error state
    setResults([]); // Clear previous results

    try {
      const response = await fetch("/api/research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, k: 5 }), // Include 'k' parameter
      });

      if (!response.ok) {
        throw new Error("Failed to fetch results");
      }

      const data = await response.json();

      // Ensure that 'results' exists and is an array
      if (Array.isArray(data.results)) {
        setResults(data.results);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching results:", error);
      setError("An error occurred while fetching search results.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 transition-colors duration-300">
      <header className="flex flex-col md:flex-row justify-between items-center p-6 bg-gray-800 shadow-md">
        <h1 className="text-2xl font-bold text-white">Stock Analysis</h1>
        {/* Future place for additional header elements */}
      </header>

      <main className="container mx-auto p-6">
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your research query"
              className="flex-grow bg-gray-700 text-white focus:ring-indigo-500 focus:border-indigo-500"
              required // Make the input required
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              ) : (
                "Search"
              )}
            </Button>
          </div>
        </form>

        {/* Display Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-800 text-red-300 rounded-md shadow">
            {error}
          </div>
        )}

        {/* Display Results */}
        {results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((result, index) => (
              <Card
                key={index}
                className="transition-transform transform hover:scale-105 shadow-lg bg-gray-800"
              >
                <CardHeader className="p-4 border-b border-gray-700">
                  <CardTitle className="text-xl font-semibold text-white">
                    {result.metadata?.Name || "Unknown Company"}
                  </CardTitle>
                  <p className="text-sm text-gray-400">
                    {result.metadata?.Sector || "No sector provided"} -{" "}
                    {result.metadata?.Industry || "No industry provided"}
                  </p>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-gray-300 text-sm mb-3">
                    <strong>Business Summary:</strong>{" "}
                    {result.metadata?.["Business Summary"] ||
                      "No business summary available."}
                  </p>
                  <div className="text-gray-400 text-sm space-y-1">
                    <p>
                      <strong>Location:</strong>{" "}
                      {result.metadata?.City || "Unknown city"},{" "}
                      {result.metadata?.State || ""}{" "}
                      {result.metadata?.Country || "Unknown country"}
                    </p>
                    <p>
                      <strong>Ticker:</strong>{" "}
                      {result.metadata?.Ticker || "N/A"}
                    </p>
                    <p>
                      <strong>Founded:</strong>{" "}
                      {result.metadata?.Founded || "Unknown"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 w-full p-6 text-center text-gray-400 bg-gray-800 shadow-inner">
        &copy; {new Date().getFullYear()} Khalid Alrais
      </footer>
    </div>
  );
}
