import axios from "axios";

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
  sortBy,
  year,
  country,
  query,
  season,
  episode,
}: Fetch) {
  const request = requestID;
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const baseURL = process.env.NEXT_PUBLIC_TMDB_API;
  const randomURL = process.env.NEXT_PUBLIC_RANDOM_URL;
  const requests: any = {
    latestMovie: `${baseURL}/movie/now_playing?api_key=${API_KEY}&language=${language}&page=${page}`, //nowPlayingMovie
    latestTv: `${baseURL}/tv/airing_today?api_key=${API_KEY}&language=${language}&page=${page}`, // airingTodayTv
    popularMovie: `${baseURL}/movie/popular?api_key=${API_KEY}&language=${language}&page=${page}&sort_by=${sortBy}`, // current popular, so similar to latestMovie data
    popularTv: `${baseURL}/tv/popular?api_key=${API_KEY}&language=${language}&page=${page}&sort_by=${sortBy}`,
    topRatedMovie: `${baseURL}/movie/top_rated?api_key=${API_KEY}&language=${language}&page=${page}`,
    topRatedTv: `${baseURL}/tv/top_rated?api_key=${API_KEY}&language=${language}&page=${page}`,
    filterMovie: `${baseURL}/discover/movie?api_key=${API_KEY}&with_genres=${genreKeywords}&language=${language}&sort_by=${sortBy}${year != undefined ? "&year=" + year : ""}${country != undefined ? "&with_origin_country=" + country : ""}&page=${page}`,
    filterTv: `${baseURL}/discover/tv?api_key=${API_KEY}&with_genres=${genreKeywords}&language=${language}&sort_by=${sortBy}${year != undefined ? "&first_air_date_year=" + year : ""}${country != undefined ? "&with_origin_country=" + country : ""}&page=${page}&with_runtime.gte=1`,
    onTheAirTv: `${baseURL}/tv/on_the_air?api_key=${API_KEY}&language=${language}&page=${page}`,
    trending: `${baseURL}/trending/all/day?api_key=${API_KEY}&language=${language}&page=${page}`,
    trendingMovie: `${baseURL}/trending/movie/week?api_key=${API_KEY}&language=${language}&page=${page}`,
    trendingTv: `${baseURL}/trending/tv/week?api_key=${API_KEY}&language=${language}&page=${page}`,
    trendingMovieDay: `${baseURL}/trending/movie/day?api_key=${API_KEY}&language=${language}&page=${page}`,
    trendingTvDay: `${baseURL}/trending/tv/day?api_key=${API_KEY}&language=${language}&page=${page}`,
    searchMulti: `${baseURL}/search/multi?api_key=${API_KEY}&query=${query}&language=${language}&page=${page}`,
    searchKeyword: `${baseURL}/search/keyword?api_key=${API_KEY}&query=${query}&language=${language}&page=${page}`,
    searchMovie: `${baseURL}/search/movie?api_key=${API_KEY}&query=${query}&language=${language}&page=${page}`,
    searchTv: `${baseURL}/search/tv?api_key=${API_KEY}&query=${query}&language=${language}&page=${page}`,

    // for a ID
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

    // person
    personMovie: `${baseURL}/person/${id}/movie_credits?api_key=${API_KEY}&language=${language}&page=${page}`,
    personTv: `${baseURL}/person/${id}/tv_credits?api_key=${API_KEY}&language=${language}&page=${page}`,

    // filters
    genresMovie: `${baseURL}/genre/movie/list?api_key=${API_KEY}&language=${language}`,
    genresTv: `${baseURL}/genre/tv/list?api_key=${API_KEY}&language=${language}`,
    countries: `${baseURL}/configuration/countries?api_key=${API_KEY}&language=${language}`,
    languages: `${baseURL}/configuration/languages?api_key=${API_KEY}`,

    // random
    random: `${randomURL}`,

    // collections
    collection: `${baseURL}/collection/${id}?api_key=${API_KEY}&language=${language}`,
    searchCollection: `${baseURL}/search/collection?api_key=${API_KEY}&query=${query}&language=${language}&page=${page}`,

    // withKeywords
    withKeywordsTv: `${baseURL}/discover/tv?api_key=${API_KEY}&with_keywords=${genreKeywords}&language=${language}&sort_by=${sortBy}${year != undefined ? "&first_air_date_year=" + year : ""}${country != undefined ? "&with_origin_country=" + country : ""}&page=${page}&air_date.lte=${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}${sortBy === "first_air_date.desc" ? "&with_runtime.gte=1" : null}`,
    withKeywordsMovie: `${baseURL}/discover/movie?api_key=${API_KEY}&with_keywords=${genreKeywords}&language=${language}&sort_by=${sortBy}${year != undefined ? "&first_air_date_year=" + year : ""}${country != undefined ? "&with_origin_country=" + country : ""}&page=${page}&release_date.lte=${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}&with_runtime.gte=1`,
  };
  const final_request = requests[request];

  try {
    const response = await axios.get(final_request);
    if (response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
