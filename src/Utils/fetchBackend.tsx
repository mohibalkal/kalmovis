import axios from "axios";
import { setCache, getCache } from "./clientCache";

interface Fetch {
  requestID: any;
  id?: string | null;
  language?: string;
  page?: number;
  genreKeywords?: string;
  sortBy?: string;
  year?: number;
  country?: string;
  query?: string;
  season?: number;
  episode?: number;
}
export default async function axiosFetch({
  requestID,
  id,
  language = "en-US",
  page = 1,
  genreKeywords,
  sortBy = "popularity.desc",
  year,
  country,
  query,
  season,
  episode,
}: Fetch) {
  const request = requestID;
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const baseURL = process.env.NEXT_PUBLIC_TMDB_API;

  const requests: any = {
    latestMovie: `${baseURL}/movie/now_playing?api_key=${API_KEY}&language=${language}&page=${page}`,
    latestTv: `${baseURL}/tv/airing_today?api_key=${API_KEY}&language=${language}&page=${page}`,
    popularMovie: `${baseURL}/movie/popular?api_key=${API_KEY}&language=${language}&page=${page}&sort_by=${sortBy}`,
    popularTv: `${baseURL}/tv/popular?api_key=${API_KEY}&language=${language}&page=${page}&sort_by=${sortBy}`,
    topRatedMovie: `${baseURL}/movie/top_rated?api_key=${API_KEY}&language=${language}&page=${page}`,
    topRatedTv: `${baseURL}/tv/top_rated?api_key=${API_KEY}&language=${language}&page=${page}`,
    filterMovie: `${baseURL}/discover/movie?api_key=${API_KEY}&with_genres=${genreKeywords}&language=${language}&sort_by=${sortBy}${year != undefined ? "&primary_release_year=" + year : ""}${country != undefined ? "&with_origin_country=" + country : ""}&page=${page}`,
    filterTv: `${baseURL}/discover/tv?api_key=${API_KEY}&with_genres=${genreKeywords}&language=${language}&sort_by=${sortBy}${year != undefined ? "&first_air_date_year=" + year : ""}${country != undefined ? "&with_origin_country=" + country : ""}&page=${page}`,
    onTheAirTv: `${baseURL}/tv/on_the_air?api_key=${API_KEY}&language=${language}&page=${page}`,
    trending: `${baseURL}/trending/all/week?api_key=${API_KEY}&language=${language}&page=${page}`,
    trendingMovie: `${baseURL}/trending/movie/week?api_key=${API_KEY}&language=${language}&page=${page}`,
    trendingTv: `${baseURL}/trending/tv/week?api_key=${API_KEY}&language=${language}&page=${page}`,
    trendingMovieDay: `${baseURL}/trending/movie/day?api_key=${API_KEY}&language=${language}&page=${page}`,
    trendingTvDay: `${baseURL}/trending/tv/day?api_key=${API_KEY}&language=${language}&page=${page}`,
    searchMulti: `${baseURL}/search/multi?api_key=${API_KEY}&query=${query}&language=${language}&page=${page}`,
    searchKeyword: `${baseURL}/search/keyword?api_key=${API_KEY}&query=${query}&language=${language}&page=${page}`,
    searchMovie: `${baseURL}/search/movie?api_key=${API_KEY}&query=${query}&language=${language}&page=${page}`,
    searchTv: `${baseURL}/search/tv?api_key=${API_KEY}&query=${query}&language=${language}&page=${page}`,
    withKeywordsTv: `${baseURL}/discover/tv?api_key=${API_KEY}&with_keywords=${genreKeywords}&language=${language}&sort_by=${sortBy}${country != undefined ? "&with_origin_country=" + country : ""}&page=${page}`,
    withKeywordsMovie: `${baseURL}/discover/movie?api_key=${API_KEY}&with_keywords=${genreKeywords}&language=${language}&sort_by=${sortBy}${country != undefined ? "&with_origin_country=" + country : ""}&page=${page}`,
    movieData: `${baseURL}/movie/${id}?api_key=${API_KEY}&language=${language}`,
    tvData: `${baseURL}/tv/${id}?api_key=${API_KEY}&language=${language}`,
    personData: `${baseURL}/person/${id}?api_key=${API_KEY}&language=${language}`,
    movieVideos: `${baseURL}/movie/${id}/videos?api_key=${API_KEY}&language=${language}`,
    tvVideos: `${baseURL}/tv/${id}/videos?api_key=${API_KEY}&language=${language}`,
    movieImages: `${baseURL}/movie/${id}/images?api_key=${API_KEY}`,
    tvImages: `${baseURL}/tv/${id}/images?api_key=${API_KEY}`,
    personImages: `${baseURL}/person/${id}/images?api_key=${API_KEY}`,
    movieCasts: `${baseURL}/movie/${id}/credits?api_key=${API_KEY}&language=${language}`,
    tvCasts: `${baseURL}/tv/${id}/credits?api_key=${API_KEY}&language=${language}`,
    movieReviews: `${baseURL}/movie/${id}/reviews?api_key=${API_KEY}&language=${language}`,
    tvReviews: `${baseURL}/tv/${id}/reviews?api_key=${API_KEY}&language=${language}`,
    movieRelated: `${baseURL}/movie/${id}/recommendations?api_key=${API_KEY}&language=${language}&page=${page}`,
    tvRelated: `${baseURL}/tv/${id}/recommendations?api_key=${API_KEY}&language=${language}&page=${page}`,
    tvEpisodes: `${baseURL}/tv/${id}/season/${season}?api_key=${API_KEY}&language=${language}`,
    tvEpisodeDetail: `${baseURL}/tv/${id}/season/${season}/episode/${episode}?api_key=${API_KEY}&language=${language}`,
    movieSimilar: `${baseURL}/movie/${id}/similar?api_key=${API_KEY}&language=${language}&page=${page}`,
    tvSimilar: `${baseURL}/tv/${id}/similar?api_key=${API_KEY}&language=${language}&page=${page}`,
    personMovie: `${baseURL}/person/${id}/movie_credits?api_key=${API_KEY}&language=${language}&page=${page}`,
    personTv: `${baseURL}/person/${id}/tv_credits?api_key=${API_KEY}&language=${language}&page=${page}`,
    genresMovie: `${baseURL}/genre/movie/list?api_key=${API_KEY}&language=${language}`,
    genresTv: `${baseURL}/genre/tv/list?api_key=${API_KEY}&language=${language}`,
    countries: `${baseURL}/configuration/countries?api_key=${API_KEY}&language=${language}`,
    languages: `${baseURL}/configuration/languages?api_key=${API_KEY}`,
    collection: `${baseURL}/collection/${id}?api_key=${API_KEY}&language=${language}`,
    searchCollection: `${baseURL}/search/collection?api_key=${API_KEY}&query=${query}&page=${page}`,
  };

  try {
    const cacheKey = requests[request];

    if (!cacheKey) {
      console.error(`Invalid request ID: ${request}`);
      return null;
    }

    const cachedData = getCache(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    if (!API_KEY) {
      console.error("TMDB API key is not configured");
      return null;
    }

    if (!baseURL) {
      console.error("TMDB API base URL is not configured");
      return null;
    }

    const response = await axios.get(requests[request], {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        accept: "application/json",
      },
    });

    if (response.data) {
      setCache(cacheKey, response.data);
      return response.data;
    }

    return null;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error in axiosFetch:", {
        request,
        url: requests[request],
        error: error.message,
        status: (error as any).response?.status,
        statusText: (error as any).response?.statusText,
      });
    } else {
      console.error("Unknown error in axiosFetch:", error);
    }
    return null;
  }
}
