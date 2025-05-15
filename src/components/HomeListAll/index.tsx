import React, { useState, useEffect } from "react";
import styles from "./style.module.scss";
import axiosFetch from "@/Utils/fetchBackend";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import MovieCardSmall from "../MovieCardSmall";
import { getContinueWatching } from "@/Utils/continueWatching";
import { useInView } from "react-intersection-observer";
import { useTranslation } from "@/Utils/i18n";
import ScrollableRow from "../ScrollableRow";

const externalImageLoader = ({ src }: { src: string }) =>
  `${process.env.NEXT_PUBLIC_TMBD_IMAGE_URL}${src}`;

function shuffle(array: any) {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

const dummyList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const HomeListAll = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [topRated, setTopRated] = useState([]);
  const [popular, setPopular] = useState([]);
  const [action, setAction] = useState([]);
  const [adventure, setAdventure] = useState([]);
  const [animation, setAnimation] = useState([]);
  const [comedy, setComedy] = useState([]);
  const [crime, setCrime] = useState([]);
  const [documentary, setDocumentary] = useState([]);
  const [drama, setDrama] = useState([]);
  const [family, setFamily] = useState([]);
  const [fantasy, setFantasy] = useState([]);
  const [history, setHistory] = useState([]);
  const [horror, setHorror] = useState([]);
  const [anime, setAnime] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch top rated
        const topRatedData = await axiosFetch({ 
          requestID: "topRatedMovie"
        });
        setTopRated(topRatedData.results);

        // Fetch popular
        const popularData = await axiosFetch({ 
          requestID: "popularMovie"
        });
        setPopular(popularData.results);

        // Fetch genre-based content
        const genreRequests = [
          { genre: "28", setter: setAction }, // Action
          { genre: "12", setter: setAdventure }, // Adventure
          { genre: "16", setter: setAnimation }, // Animation
          { genre: "35", setter: setComedy }, // Comedy
          { genre: "80", setter: setCrime }, // Crime
          { genre: "99", setter: setDocumentary }, // Documentary
          { genre: "18", setter: setDrama }, // Drama
          { genre: "10751", setter: setFamily }, // Family
          { genre: "14", setter: setFantasy }, // Fantasy
          { genre: "36", setter: setHistory }, // History
          { genre: "27", setter: setHorror }, // Horror
        ];

        await Promise.all(
          genreRequests.map(async ({ genre, setter }) => {
            const data = await axiosFetch({
              requestID: "filterMovie",
              genreKeywords: genre,
              sortBy: "popularity.desc"
            });
            setter(data.results);
          })
        );

        // Fetch anime
        const animeData = await axiosFetch({
          requestID: "withKeywordsTv",
          sortBy: "vote_count.desc",
          genreKeywords: "210024,",
        });
        setAnime(animeData.results);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className={styles.HomeListAll}>
      <ScrollableRow
        title={t("common.topRated")}
        items={topRated}
        loading={loading}
      />
      <ScrollableRow
        title={t("media.popularMovies")}
        items={popular}
        loading={loading}
      />
      <ScrollableRow
        title={t("filters.categories.action")}
        items={action}
        loading={loading}
      />
      <ScrollableRow
        title={t("filters.categories.adventure")}
        items={adventure}
        loading={loading}
      />
      <ScrollableRow
        title={t("filters.categories.animation")}
        items={animation}
        loading={loading}
      />
      <ScrollableRow
        title={t("filters.categories.comedy")}
        items={comedy}
        loading={loading}
      />
      <ScrollableRow
        title={t("filters.categories.crime")}
        items={crime}
        loading={loading}
      />
      <ScrollableRow
        title={t("filters.categories.documentary")}
        items={documentary}
        loading={loading}
      />
      <ScrollableRow
        title={t("filters.categories.drama")}
        items={drama}
        loading={loading}
      />
      <ScrollableRow
        title={t("filters.categories.family")}
        items={family}
        loading={loading}
      />
      <ScrollableRow
        title={t("filters.categories.fantasy")}
        items={fantasy}
        loading={loading}
      />
      <ScrollableRow
        title={t("filters.categories.history")}
        items={history}
        loading={loading}
      />
      <ScrollableRow
        title={t("filters.categories.horror")}
        items={horror}
        loading={loading}
      />
      <ScrollableRow
        title={t("common.anime")}
        items={anime}
        loading={loading}
      />
    </div>
  );
};

export default HomeListAll;
