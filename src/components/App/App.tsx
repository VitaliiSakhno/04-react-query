import { useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { useEffect } from "react";

import SearchBar from "../SearchBar/SearchBar";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";

import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";

import toast, { Toaster } from "react-hot-toast";

import "./App.module.css";

function App() {
  const [query, setQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const {data, isLoading, isError } = useQuery({
    queryKey: ['movies', query],
    queryFn: () => fetchMovies(query),
    enabled: query !== ''
  });

  const movies = data ?? [];

  const handleSearch = async (query: string) => {
    setQuery(query);

    useEffect(() => {
      if (data && movies.length === 0) {
        toast('No movies found on your request');
      }
    }, [data, movies.length]);
  };

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
      {movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleSelect} />
      )}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleClose} />
      )}
    </>
  );
}

export default App;
