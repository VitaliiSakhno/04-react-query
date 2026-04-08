import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useEffect } from "react";

import SearchBar from "../SearchBar/SearchBar";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import Pagination from "../Pagination/Pagination";

import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";

import toast, { Toaster } from "react-hot-toast";

import "./App.module.css";

function App() {
  const [query, setQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["movies", query, currentPage],
    queryFn: () => fetchMovies(query, currentPage),
    enabled: query !== "",
    placeholderData: keepPreviousData,
  });

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  const handleSearch = (query: string) => {
    setQuery(query);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (isSuccess && movies.length === 0) {
      toast('No movies found on your request');
    }
  }, [isSuccess, movies.length]);

  const handleSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleClose = () => {
    setSelectedMovie(null);
  };

  return (
    <>
      <Toaster />
      <SearchBar onSubmit={handleSearch} />
      {isSuccess && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleSelect} />
      )}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleClose} />
      )}
      {isSuccess && totalPages > 1 && (
        <Pagination
        pageCount={totalPages}
        forcePage={currentPage}
        onPageChange={setCurrentPage}
        />
      )}
    </>
  );
}

export default App;
