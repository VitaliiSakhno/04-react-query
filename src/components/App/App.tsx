import { useState } from "react";

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
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = async (query: string) => {
    try {
      setIsLoading(true);
      setIsError(false);
      setMovies([]);
      const result = await fetchMovies(query);
      setMovies(result);
      if (result.length === 0) {
        toast("No movies found on your request");
      }
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
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
