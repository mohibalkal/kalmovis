import axios from "axios";
import { TMDB_CONFIG } from "@/Utils/tmdb";

const tmdbApi = axios.create({
  baseURL: TMDB_CONFIG.BASE_URL,
  headers: {
    Authorization: `Bearer ${TMDB_CONFIG.API_KEY}`,
    "Content-Type": "application/json",
  },
});

export const getTrendingMovies = async (page = 1, timeWindow = "week") => {
  try {
    const response = await tmdbApi.get(`/trending/movie/${timeWindow}`, {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    throw error;
  }
};

export const getMovieDetails = async (movieId: number) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}`, {
      params: {
        append_to_response: "videos,credits,similar,recommendations",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};

export const searchMovies = async (query: string, page = 1) => {
  try {
    const response = await tmdbApi.get("/search/movie", {
      params: {
        query,
        page,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching movies:", error);
    throw error;
  }
};

export const getMovieVideos = async (movieId: number) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}/videos`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movie videos:", error);
    throw error;
  }
};

export const getImageUrl = (path: string, size: string) => {
  if (!path) return "";
  return `${TMDB_CONFIG.IMAGE_BASE_URL}/${size}${path}`;
};
