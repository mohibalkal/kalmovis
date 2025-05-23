import { useState, useEffect, useRef } from "react";
import styles from "./style.module.scss";
import axiosFetch from "@/Utils/fetchBackend";
import Link from "next/link";
// import { motion, AnimatePresence } from "framer-motion";
import MovieCardLarge from "../MovieCardLarge";
import { FaPlay, FaStar } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import ReactPaginate from "react-paginate";
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai";
import { useTranslation } from "@/Utils/i18n";

// react-lazy-load-image-component
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/opacity.css";

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const dummyList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const MetaDetails = ({ id, type, data }: any) => {
  const { t } = useTranslation();
  const [category, setCategory] = useState<any>("overview"); // latest, trending, topRated
  const [categoryData, setCategoryData] = useState<any>();
  const [imageLoading, setImageLoading] = useState<any>(true);
  const [reviewDetail, setReviewDetail] = useState<any>("");
  const [selectedSeason, setSelectedSeason] = useState<any>(1);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalpages, setTotalpages] = useState(1);
  const [genreListMovie, setGenreListMovie] = useState<any>();
  const [genreListTv, setGenreListTv] = useState<any>();
  const [imagePlaceholder, setImagePlaceholder] = useState(false);
  const metaDetailsPage: any = useRef(null);

  const genres: Array<string> = [];
  data?.genres?.map((ele: any) => {
    genres.push(ele.name);
  });
  const spoken_languages: Array<string> = [];
  data?.spoken_languages?.map((ele: any) => {
    spoken_languages.push(ele?.english_name || ele?.name);
  });
  const production_countries: Array<string> = [];
  data?.production_countries?.map((ele: any) => {
    production_countries.push(ele.name);
  });
  const production_companies: Array<string> = [];
  data?.production_companies?.map((ele: any) => {
    production_companies.push(ele.name);
  });
  const release_date = new Date(data?.release_date || data?.first_air_date);
  const end_date = new Date(data?.last_air_date);
  const birthday = new Date(data?.birthday);
  const monthNames = [
    t("months.january"),
    t("months.february"),
    t("months.march"),
    t("months.april"),
    t("months.may"),
    t("months.june"),
    t("months.july"),
    t("months.august"),
    t("months.september"),
    t("months.october"),
    t("months.november"),
    t("months.december"),
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gM = await axiosFetch({ requestID: "genresMovie" });
        const gT = await axiosFetch({ requestID: "genresTv" });
        setGenreListMovie(gM.genres);
        setGenreListTv(gT.genres);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const CapitalCategoryType = capitalizeFirstLetter(category);
      if (category !== "overview") {
        try {
          let res;
          if (category === "episodes") {
            res = await axiosFetch({
              requestID: `${type}${CapitalCategoryType}`,
              id: id,
              season: selectedSeason,
            });
          } else {
            res = await axiosFetch({
              requestID: `${type}${CapitalCategoryType}`,
              id: id,
              page: currentPage,
            });
            setCurrentPage(res?.page);
            setTotalpages(res?.total_pages);
          }
          setCategoryData(res);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };
    fetchData();
  }, [category, selectedSeason, currentPage]);

  const scrollToTop = () => {
    metaDetailsPage?.current?.scrollTo(0, 0);
  };

  return (
    <div className={styles.MetaDetailPage}>
      <div className={styles.MetaDetails} ref={metaDetailsPage}>
        <div className={styles.category}>
          {type === "tv" ? (
            <p
              className={`${category === "episodes" ? styles.active : styles.inactive}`}
              onClick={() => setCategory("episodes")}
            >
              {t("detail.episodes")}
            </p>
          ) : null}
          <p
            className={`${category === "overview" ? styles.active : styles.inactive}`}
            onClick={() => setCategory("overview")}
          >
            {t("detail.overview")}
          </p>
          {type !== "person" ? (
            <>
              <p
                className={`${category === "casts" ? styles.active : styles.inactive}`}
                onClick={() => setCategory("casts")}
              >
                {t("detail.casts")}
              </p>
              <p
                className={`${category === "reviews" ? styles.active : styles.inactive}`}
                onClick={() => setCategory("reviews")}
              >
                {t("detail.reviews")}
              </p>
              <p
                className={`${category === "related" ? styles.active : styles.inactive}`}
                onClick={() => setCategory("related")}
              >
                {t("detail.related")}
              </p>
            </>
          ) : (
            <>
              <p
                className={`${category === "movie" ? styles.active : styles.inactive}`}
                onClick={() => setCategory("movie")}
              >
                {t("detail.movies")}
              </p>
              <p
                className={`${category === "tv" ? styles.active : styles.inactive}`}
                onClick={() => setCategory("tv")}
              >
                {t("detail.tvShows")}
              </p>
            </>
          )}
        </div>

        {type === "tv" && category === "episodes" ? (
          <div className={styles.EpisodeList}>
            <select
              name="season"
              id="season"
              value={selectedSeason}
              onChange={(e: any) => setSelectedSeason(e.target.value)}
            >
              {data?.seasons?.map((ele: any, i: number) => {
                console.log({ i });
                return (
                  <option
                    key={ele.id}
                    value={ele?.season_number}
                    selected={i == 0}
                  >
                    {ele.name} {` (${ele.episode_count})`}
                  </option>
                );
              })}
            </select>
            {category === "episodes" &&
              categoryData?.episodes?.map((ele: any) => {
                return (
                  <div
                    className={`${styles.episode} ${reviewDetail === ele?.id ? styles.ReviewDetail : null} ${new Date(ele?.air_date) >= new Date() ? styles.notAired : null}`}
                    onClick={() =>
                      setReviewDetail((prev: any) =>
                        prev !== ele?.id ? ele?.id : "",
                      )
                    }
                  >
                    <Link
                      href={`/watch?type=tv&id=${ele?.show_id}&season=${ele?.season_number}&episode=${ele?.episode_number}`}
                      className={`${styles.CardSmall}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div
                        className={`${styles.img} ${imageLoading ? "skeleton" : null}`}
                      >
                        {/* if rllic package is not available, then start using this code again, and comment/delete the rllic code */}
                        {/* <AnimatePresence mode="sync">
                          <motion.img
                            key={ele?.id}
                            src={`${ele?.still_path !== null && ele?.still_path !== undefined ? process.env.NEXT_PUBLIC_TMBD_IMAGE_URL + ele?.still_path : "/images/logo.svg"}`}
                            initial={{ opacity: 0 }}
                            animate={{
                              opacity: imageLoading ? 0 : 1,
                            }}
                            height="100%"
                            width="100%"
                            exit="exit"
                            className={`${styles.img} ${imageLoading ? "skeleton" : null}`}
                            onLoad={() => {
                              setImageLoading(false);
                            }}
                            loading="lazy"
                            // style={!imageLoading ? { opacity: 1 } : { opacity: 0 }}
                          />
                        </AnimatePresence> */}

                        {/* react-lazy-load-image-component */}
                        <LazyLoadImage
                          key={ele?.id}
                          src={`${imagePlaceholder ? "/images/logo.svg" : ele?.still_path !== null && ele?.still_path !== undefined ? process.env.NEXT_PUBLIC_TMBD_IMAGE_URL + ele?.still_path : "/images/logo.svg"}`}
                          height="100%"
                          width="100%"
                          useIntersectionObserver={true}
                          effect="opacity"
                          className={`${styles.img} ${imageLoading ? "skeleton" : null}`}
                          onLoad={() => {
                            setImageLoading(false);
                          }}
                          onError={(e) => {
                            // console.log({ e });
                            setImagePlaceholder(true);
                            setImageLoading(false);
                          }}
                          loading="lazy"
                          // style={!imageLoading ? { opacity: 1 } : { opacity: 0 }}
                        />
                      </div>
                    </Link>
                    <div className={styles.details}>
                      <h4>
                        {`EP ${ele.episode_number}`}
                        {`${ele?.name ? " : " + ele?.name : null}`}
                      </h4>
                      <p>
                        {`${ele?.vote_average >= 0 ? "• " + ele?.vote_average.toFixed(1) : null}`}{" "}
                        {ele?.runtime >= 60
                          ? `• ${Math.floor(ele?.runtime / 60)}hr ${(ele?.runtime % 60).toFixed(0)}min`
                          : null}
                        {ele?.runtime < 60
                          ? `• ${(ele?.runtime % 60).toFixed(0)}min `
                          : null}
                        {new Date(ele?.air_date) >= new Date() ? (
                          <span
                            className={styles.notAiredTag}
                          >{`• ${new Date(ele?.air_date).getDate()} ${monthNames[new Date(ele?.air_date).getMonth()]} ${new Date(ele?.air_date).getFullYear()}`}</span>
                        ) : null}
                      </p>
                      <Link
                        className={`${styles.links} btn`}
                        href={`/watch?type=tv&id=${ele?.show_id}&season=${ele?.season_number}&episode=${ele?.episode_number}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {t("detail.watch")} <FaPlay />
                      </Link>
                      <p>{ele?.overview}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : null}

        {type === "tv" &&
        category === "episodes" &&
        categoryData?.episodes?.length === 0 ? (
          <p>No Episodes Found</p>
        ) : null}

        {type === "tv" && category === "episodes" && categoryData === undefined
          ? dummyList.map((ele) => (
              <div className={styles.episode}>
                <Skeleton
                  height={100}
                  className={styles.CardSmall}
                  style={{ margin: "0.5rem 0" }}
                />
              </div>
            ))
          : null}
        <div className={styles.categoryDetails}>
          {category === "overview" && type !== "person" && (
            <>
              {data?.tagline ? (
                <h4>
                  <q>{data?.tagline}</q>
                </h4>
              ) : null}
              <div className={styles.Overview}>
                {data?.overview ? (
                  <p>{data?.overview}</p>
                ) : (
                  <p>{t("detail.noOverviewAvailable")}</p>
                )}
                <hr />
                <div className={styles.metaGrid}>
                  {data?.release_date && (
                    <div className={styles.metaItem}>
                      <h3>{t("detail.releaseDate")}</h3>
                      <p>{`${release_date.getDate()} ${monthNames[release_date.getMonth()]} ${release_date.getFullYear()}`}</p>
                    </div>
                  )}
                  {data?.first_air_date && (
                    <div className={styles.metaItem}>
                      <h3>{t("detail.firstAirDate")}</h3>
                      <p>{`${release_date.getDate()} ${monthNames[release_date.getMonth()]} ${release_date.getFullYear()}`}</p>
                    </div>
                  )}
                  {data?.last_air_date && data?.status === "Ended" && (
                    <div className={styles.metaItem}>
                      <h3>{t("detail.lastAirDate")}</h3>
                      <p>{`${end_date.getDate()} ${monthNames[end_date.getMonth()]} ${end_date.getFullYear()}`}</p>
                    </div>
                  )}
                  {genres?.length > 0 && (
                    <div className={styles.metaItem}>
                      <h3>{t("detail.genre")}</h3>
                      <p>{genres.join(", ")}</p>
                    </div>
                  )}
                  {data?.status && (
                    <div className={styles.metaItem}>
                      <h3>{t("detail.status")}</h3>
                      {/* Assuming data.status might be like "Ended", "Returning Series" which might need translation if they are consistent values */}
                      <p>
                        {t(
                          `status.${data.status.toLowerCase().replace(/ /g, "_")}`,
                        ) || data.status}
                      </p>
                    </div>
                  )}
                  {type === "tv" && data?.number_of_seasons && (
                    <div className={styles.metaItem}>
                      <h3>{t("detail.totalSeasons")}</h3>
                      <p>{data?.number_of_seasons}</p>
                    </div>
                  )}
                  {type === "tv" && data?.number_of_episodes && (
                    <div className={styles.metaItem}>
                      <h3>{t("detail.totalEpisodes")}</h3>
                      <p>{data?.number_of_episodes}</p>
                    </div>
                  )}
                  {production_countries?.length > 0 && (
                    <div className={styles.metaItem}>
                      <h3>{t("detail.productionCountries")}</h3>
                      <p>{production_countries.join(", ")}</p>
                    </div>
                  )}
                  {spoken_languages?.length > 0 && (
                    <div className={styles.metaItem}>
                      <h3>{t("detail.spokenLanguages")}</h3>
                      <p>{spoken_languages.join(", ")}</p>
                    </div>
                  )}
                  {data?.budget > 0 && (
                    <div className={styles.metaItem}>
                      <h3>{t("detail.budget")}</h3>
                      <p>${data?.budget?.toLocaleString()}</p>
                    </div>
                  )}
                  {data?.revenue > 0 && (
                    <div className={styles.metaItem}>
                      <h3>{t("detail.revenue")}</h3>
                      <p>${data?.revenue?.toLocaleString()}</p>
                    </div>
                  )}
                  {data?.homepage && (
                    <div className={styles.metaItem}>
                      <h3>{t("detail.homepage")}</h3>
                      <p>
                        <Link
                          href={data.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {t("detail.visitHomepage")}
                        </Link>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
          {category === "overview" && type === "person" && (
            <>
              <p>{data?.biography}</p>
              {birthday.getDate() ? (
                <>
                  <h3>{t("detail.birthday")}</h3>
                  <p>{`${birthday.getDate()} ${monthNames[birthday.getMonth()]} ${birthday.getFullYear()}`}</p>
                </>
              ) : null}
              {data?.place_of_birth ? (
                <>
                  <h3>{t("detail.placeOfBirth")}</h3>
                  <p>{data?.place_of_birth}</p>
                </>
              ) : null}
              {data?.known_for_department ? (
                <>
                  <h3>{t("detail.department")}</h3>
                  <p>{data?.known_for_department}</p>
                </>
              ) : null}
            </>
          )}
          {category === "overview" && (data == undefined || data === null) && (
            <Skeleton count={10} style={{ margin: "0.5rem 0" }} />
          )}
          <div className={styles.casts}>
            {category === "casts" && (
              <>
                <h4 className={styles.header}>{t("detail.cast")}</h4>
                {categoryData?.cast?.map((ele: any) => (
                  <div className={styles.cast}>
                    <Link
                      href={`/person?id=${ele?.id}`}
                      className={styles.CardSmall}
                    >
                      <div
                        className={`${styles.img} ${imageLoading ? "skeleton" : null}`}
                      >
                        {/* if rllic package is not available, then start using this code again, and comment/delete the rllic code */}
                        {/* <AnimatePresence mode="sync">
                          <motion.img
                            key={ele?.id}
                            src={`${ele?.profile_path !== null && ele?.profile_path !== undefined ? process.env.NEXT_PUBLIC_TMBD_IMAGE_URL + ele?.profile_path : "/images/logo.svg"}`}
                            initial={{ opacity: 0 }}
                            animate={{
                              opacity: imageLoading ? 0 : 1,
                            }}
                            height="100%"
                            width="100%"
                            exit="exit"
                            className={`${styles.img} ${imageLoading ? "skeleton" : null}`}
                            onLoad={() => {
                              setImageLoading(false);
                            }}
                            loading="lazy"
                          // style={!imageLoading ? { opacity: 1 } : { opacity: 0 }}
                          />
                        </AnimatePresence> */}

                        {/* react-lazy-load-image-component */}
                        <LazyLoadImage
                          key={ele?.id}
                          src={`${imagePlaceholder ? "/images/logo.svg" : ele?.profile_path !== null && ele?.profile_path !== undefined ? process.env.NEXT_PUBLIC_TMBD_IMAGE_URL + ele?.profile_path : "/images/logo.svg"}`}
                          height="100%"
                          width="100%"
                          useIntersectionObserver={true}
                          effect="opacity"
                          className={`${styles.img} ${imageLoading ? "skeleton" : null}`}
                          onLoad={() => {
                            setImageLoading(false);
                          }}
                          onError={(e) => {
                            // console.log({ e });
                            setImagePlaceholder(true);
                            setImageLoading(false);
                          }}
                          loading="lazy"
                          // style={!imageLoading ? { opacity: 1 } : { opacity: 0 }}
                        />
                      </div>
                    </Link>
                    <div className={styles.castName}>
                      <h4>{ele?.name}</h4>
                      <p>{ele?.character}</p>
                    </div>
                  </div>
                ))}
                {category === "casts" &&
                  categoryData === undefined &&
                  dummyList.map((ele) => (
                    <div className={styles.cast}>
                      <Skeleton height={100} width={100} />
                      <Skeleton height={20} width={50} />
                    </div>
                  ))}
                <h4 className={styles.header}>{t("detail.crew")}</h4>
                {categoryData?.crew?.map((ele: any) => (
                  <div className={styles.cast}>
                    <Link
                      href={`/person?id=${ele?.id}`}
                      className={styles.CardSmall}
                    >
                      <div
                        className={`${styles.img} ${imageLoading ? "skeleton" : null}`}
                      >
                        {/* if rllic package is not available, then start using this code again, and comment/delete the rllic code */}
                        {/* <AnimatePresence mode="sync">
                          <motion.img
                            key={ele?.id}
                            src={`${ele?.profile_path !== null && ele?.profile_path !== undefined ? process.env.NEXT_PUBLIC_TMBD_IMAGE_URL + ele?.profile_path : "/images/logo.svg"}`}
                            initial={{ opacity: 0 }}
                            animate={{
                              opacity: imageLoading ? 0 : 1,
                            }}
                            height="100%"
                            width="100%"
                            exit="exit"
                            className={`${styles.img} ${imageLoading ? "skeleton" : null}`}
                            onLoad={() => {
                              setImageLoading(false);
                            }}
                            loading="lazy"
                          // style={!imageLoading ? { opacity: 1 } : { opacity: 0 }}
                          />
                        </AnimatePresence> */}

                        {/* react-lazy-load-image-component */}
                        <LazyLoadImage
                          key={ele?.id}
                          src={`${imagePlaceholder ? "/images/logo.svg" : ele?.profile_path !== null && ele?.profile_path !== undefined ? process.env.NEXT_PUBLIC_TMBD_IMAGE_URL + ele?.profile_path : "/images/logo.svg"}`}
                          height="100%"
                          width="100%"
                          useIntersectionObserver={true}
                          effect="opacity"
                          className={`${styles.img} ${imageLoading ? "skeleton" : null}`}
                          onLoad={() => {
                            setImageLoading(false);
                          }}
                          onError={(e) => {
                            // console.log({ e });
                            setImagePlaceholder(true);
                            setImageLoading(false);
                          }}
                          loading="lazy"
                          // style={!imageLoading ? { opacity: 1 } : { opacity: 0 }}
                        />
                      </div>
                    </Link>
                    <div className={styles.castName}>
                      <h4>{ele?.name}</h4>
                      <p>{ele?.character || ele?.job}</p>
                    </div>
                  </div>
                ))}
                {category === "casts" &&
                  categoryData === undefined &&
                  dummyList.map((ele) => (
                    <div className={styles.cast}>
                      <Skeleton height={100} width={100} />
                      <Skeleton height={20} width={50} />
                    </div>
                  ))}
              </>
            )}
          </div>
          <div className={styles.MovieList}>
            <>
              {category === "related" &&
                categoryData?.results?.map((ele: any) => {
                  return (
                    <MovieCardLarge
                      data={ele}
                      media_type={type}
                      genresMovie={genreListMovie}
                      genresTv={genreListTv}
                    />
                  );
                })}
              {category === "related" && categoryData?.results?.length > 0 && (
                <ReactPaginate
                  containerClassName={styles.pagination}
                  pageClassName={styles.page_item}
                  activeClassName={styles.paginateActive}
                  onPageChange={(event) => {
                    setCurrentPage(event.selected + 1);
                    console.log({ event });
                    if (currentPage > totalpages) {
                      setCurrentPage(totalpages);
                    }
                    window.scrollTo(0, 0);
                    scrollToTop();
                  }}
                  pageCount={totalpages}
                  breakLabel=" ... "
                  previousLabel={
                    <AiFillLeftCircle className={styles.paginationIcons} />
                  }
                  nextLabel={
                    <AiFillRightCircle className={styles.paginationIcons} />
                  }
                />
              )}
            </>
            {category === "related" && categoryData?.results?.length === 0 && (
              <p>{t("detail.noRecommendations")}</p>
            )}
            {category === "related" &&
              categoryData === undefined &&
              dummyList.map((ele) => (
                <div className={styles.MovieList}>
                  <Skeleton height={150} width={100} />
                  <div>
                    <Skeleton height={20} width={150} />
                    <Skeleton height={20} width={150} />
                    <Skeleton height={20} width={150} />
                  </div>
                </div>
              ))}
          </div>
          <div className={styles.ReviewList}>
            {category === "reviews" &&
              categoryData?.results?.map((ele: any) => {
                const review_date = new Date(ele?.created_at);
                return (
                  <div
                    className={`${styles.Review} ${reviewDetail === ele?.id ? styles.ReviewDetail : null}`}
                    onClick={() =>
                      setReviewDetail((prev: any) =>
                        prev !== ele?.id ? ele?.id : "",
                      )
                    }
                  >
                    <h4>{ele?.author}</h4>
                    <p>{`${review_date.getDate()} ${monthNames[review_date.getMonth()]} ${review_date.getFullYear()}`}</p>
                    <p className={styles.rating}>
                      <FaStar /> {ele?.author_details?.rating}
                    </p>
                    <p>{ele?.content}</p>
                  </div>
                );
              })}
            {category === "reviews" && categoryData?.results?.length === 0 ? (
              <div className={styles.Review}>
                <p>{t("detail.noReviewsFound")}</p>
              </div>
            ) : null}
            {category === "reviews" &&
              categoryData === undefined &&
              dummyList.map((ele) => <Skeleton height={200} width={250} />)}
          </div>
          <div className={styles.MovieList}>
            {category === "movie" &&
              categoryData?.cast?.map((ele: any, ind: any) => {
                return (
                  <div className={styles.numberedCard}>
                    <MovieCardLarge
                      data={ele}
                      media_type="movie"
                      genresMovie={genreListMovie}
                      genresTv={genreListTv}
                    />
                    <span className={styles.number}>{ind + 1}</span>
                  </div>
                );
              })}
            {category === "movie" &&
              data?.known_for_department !== "Acting" &&
              categoryData?.crew?.map((ele: any, ind: any) => {
                return (
                  <div className={styles.numberedCard}>
                    <MovieCardLarge
                      data={ele}
                      media_type="movie"
                      genresMovie={genreListMovie}
                      genresTv={genreListTv}
                    />
                    <span className={styles.number}>{ind + 1}</span>
                  </div>
                );
              })}
            {category === "movie" &&
              categoryData === undefined &&
              dummyList.map((ele) => (
                <div className={styles.MovieList}>
                  <Skeleton height={150} width={100} />
                  <Skeleton height={50} width={150} />
                </div>
              ))}
          </div>
          <div className={styles.MovieList}>
            {category === "tv" &&
              categoryData?.cast?.map((ele: any, ind: any) => {
                return (
                  <div className={styles.numberedCard}>
                    <MovieCardLarge
                      data={ele}
                      media_type="tv"
                      genresMovie={genreListMovie}
                      genresTv={genreListTv}
                    />
                    <span className={styles.number}>{ind + 1}</span>
                  </div>
                );
              })}
            {category === "tv" &&
              data?.known_for_department !== "Acting" &&
              categoryData?.crew?.map((ele: any, ind: any) => {
                return (
                  <div className={styles.numberedCard}>
                    <MovieCardLarge
                      data={ele}
                      media_type="tv"
                      genresMovie={genreListMovie}
                      genresTv={genreListTv}
                    />
                    <span className={styles.number}>{ind + 1}</span>
                  </div>
                );
              })}
            {category === "tv" &&
              categoryData === undefined &&
              dummyList.map((ele) => (
                <div className={styles.MovieList}>
                  <Skeleton height={150} width={100} />
                  <Skeleton height={50} width={150} />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetaDetails;
