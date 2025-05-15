/** @type {import('next').NextConfig} */
// import withPWA from "next-pwa";

const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_TMBD_IMAGE_URL: "https://image.tmdb.org/t/p/original",
    NEXT_PUBLIC_TMDB_API: "https://api.themoviedb.org/3",
    NEXT_PUBLIC_FB_API_KEY:
      "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NWI5NzVkNTc1Njk4YTYzNmFhNDk0OGM4NmU0NGU0NSIsIm5iZiI6MTcyMzc1OTU0Mi45NzgsInN1YiI6IjY2YmU3YmI2MmJlNTQ2ZDE4ZmMzOGMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.E9iIva5iS3shTEwzpyztYdjaRngzX7dtRjnL7kaY-EE",
    NEXT_PUBLIC_FB_AUTH_DOMAIN: "kalsima-a0a28.firebaseapp.com",
    NEXT_PUBLIC_FB_PROJECT_ID: "kalsima-a0a28",
    NEXT_PUBLIC_FB_STORAGE_BUCKET: "kalsima-a0a28.firebasestorage.app",
    NEXT_PUBLIC_FB_SENDER_ID: "596416765865",
    NEXT_PUBLIC_FB_APP_ID: "1:596416765865:web:35e9a0a0bac47aa12e6eb8",
    NEXT_PUBLIC_FB_MEASUREMENT_ID: "G-XC71BF1WP9",
    NEXT_PUBLIC_TMDB_API_KEY: "65b975d575698a636aa4948c86e44e45",
    NEXT_PUBLIC_STREAM_URL_AGG: "https://alkal-api.netlify.app/embed",
    NEXT_PUBLIC_STREAM_URL_VID: "https://vidsrc.me/embed",
    NEXT_PUBLIC_STREAM_URL_PRO: "https://vidlink.pro/embed",
    NEXT_PUBLIC_STREAM_URL_EMB: "https://www.2embed.cc/embed",
    NEXT_PUBLIC_STREAM_URL_MULTI: "https://vidlink.pro",
    NEXT_PUBLIC_STREAM_URL_SUP: "https://vidsrc.to/embed",
    NEXT_PUBLIC_STREAM_URL_SUPER: "https://www.superembed.stream",
    NEXT_PUBLIC_STREAM_URL_MOVIES: "https://moviesapi.club",
    NEXT_PUBLIC_STREAM_URL_SMASHY: "https://moviekex.online",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
    ],
  },
};

// const withPwaConfig = withPWA({
//   dest: "public",
//   register: true,
//   skipWaiting: true,
//   disable: process.env.NODE_ENV === 'development'
// });

// export default withPwaConfig(nextConfig);
export default nextConfig;
