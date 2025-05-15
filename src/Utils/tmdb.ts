export const TMDB_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_TMDB_API || "https://api.themoviedb.org/3",
  API_KEY: process.env.NEXT_PUBLIC_TMDB_API_KEY || "",
  IMAGE_BASE_URL:
    process.env.NEXT_PUBLIC_TMBD_IMAGE_URL || "https://image.tmdb.org/t/p",
};
