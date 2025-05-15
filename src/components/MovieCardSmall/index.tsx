import React from "react";
import styles from "./style.module.scss";
import Link from "next/link";
import Image from "next/image";
import { MdStar } from "react-icons/md";
// import { motion, AnimatePresence } from "framer-motion";
// import Skeleton from "react-loading-skeleton";

// react-lazy-load-image-component
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/opacity.css";
import { useTranslation } from "@/Utils/i18n";

interface MovieCardSmallProps {
  data: {
    id: string;
    title?: string;
    name?: string;
    poster_path: string;
    vote_average: number;
    release_date?: string;
    first_air_date?: string;
  };
  media_type?: string;
}

const externalImageLoader = ({ src }: { src: string }) =>
  `${process.env.NEXT_PUBLIC_TMBD_IMAGE_URL}${src}`;

const MovieCardSmall = ({ data, media_type = "movie" }: MovieCardSmallProps) => {
  const [imageLoading, setImageLoading] = React.useState(true);
  const [imagePlaceholder, setImagePlaceholder] = React.useState(false);
  const { t } = useTranslation();

  const year = data?.release_date?.split("-")[0] || data?.first_air_date?.split("-")[0];
  
  // Keep the original English title
  const title = data?.title || data?.name || "";
  const mediaTypeLabel = t(`media.type.${media_type}`);

  return (
    <Link
      key={data?.id}
      href={`${media_type === "collection" ? `/collections/${data?.id}` : `/detail?type=${media_type}&id=${data?.id}`}`}
      className={styles.MovieCardSmall}
      aria-label={`${mediaTypeLabel}: ${title}`}
      data-tooltip-id="tooltip"
      data-tooltip-html={title.length > 30 ? title : ""}
    >
      <Image
        loader={externalImageLoader}
        src={data?.poster_path || "/images/logo.svg"}
        alt={title || "Movie Poster"}
        className={styles.poster}
        width={160}
        height={240}
        priority
      />
      <div className={styles.meta}>
        <h3>{title}</h3>
        <div className={styles.info}>
          {data?.vote_average > 0 && (
            <div className={styles.rating}>
              <MdStar />
              {data.vote_average.toFixed(1)}
            </div>
          )}
          {year && <span className={styles.year}>{year}</span>}
        </div>
      </div>
    </Link>
  );
};

export default MovieCardSmall;
