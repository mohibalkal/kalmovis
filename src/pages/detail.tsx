import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import styles from "@/styles/Detail.module.scss";
import MetaDetails from "@/components/MetaDetails";
import Carousel from "@/components/Carousel";
import axiosFetch from "@/Utils/fetchBackend";
import MoviePoster from "@/components/MoviePoster";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import {
  BsBookmarkPlus,
  BsFillBookmarkCheckFill,
  BsShare,
} from "react-icons/bs";
import { FaPlay, FaYoutube } from "react-icons/fa";
import {
  setBookmarks,
  checkBookmarks,
  removeBookmarks,
} from "@/Utils/bookmark";
import { navigatorShare } from "@/Utils/share";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/Utils/firebase";
import { toast } from "sonner";
import { useTranslation } from "@/Utils/i18n";

const DetailPage = () => {
  const { t } = useTranslation();
  const params = useSearchParams();
  const [type, setType] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [season, setSeason] = useState<string>("");
  const [episode, setEpisode] = useState<string>("");
  const [index, setIndex] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [data, setData] = useState<any>({});
  const [bookmarked, setBookmarked] = useState(false);
  const [trailer, setTrailer] = useState<any>("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>();

  useEffect(() => {
    setLoading(true);
    const newType = params?.get("type") || "";
    const newId = params?.get("id") || "";
    const newSeason = params?.get("season") || "";
    const newEpisode = params?.get("episode") || "";

    setType(newType);
    setId(newId);
    setSeason(newSeason);
    setEpisode(newEpisode);

    const fetchData = async () => {
      if (!newType || !newId) {
        setLoading(false);
        return;
      }

      try {
        const data = await axiosFetch({
          requestID: `${newType}Data`,
          id: newId,
        });
        if (data) {
          setData(data);
        }

        const Videos = await axiosFetch({
          requestID: `${newType}Videos`,
          id: newId,
        });
        if (Videos?.results) {
          setTrailer(
            Videos.results.find(
              (ele: any) => ele.type === "Trailer" && ele.official === true,
            ),
          );
        }

        const response = await axiosFetch({
          requestID: `${newType}Images`,
          id: newId,
        });

        if (response?.backdrops) {
          let arr: any = [];
          response.backdrops.forEach((ele: any) => {
            if (ele.file_path) {
              arr.push(process.env.NEXT_PUBLIC_TMBD_IMAGE_URL + ele.file_path);
            }
          });
          if (arr.length === 0) {
            arr.push("/images/logo.svg");
          }
          setImages(arr);
        } else {
          setImages(["/images/logo.svg"]);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setImages(["/images/logo.svg"]);
        setLoading(false);
      }
    };

    fetchData();
  }, [params]);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userID = user.uid;
        setUser(userID);
        // setIds(await getBookmarks(userID)?.movie)
        setLoading(false);
      } else {
        setLoading(true);
      }
    });
  }, []);

  useEffect(() => {
    const fetch = async () => {
      if (data !== undefined && data !== null) {
        if (user !== undefined && user !== null)
          setBookmarked(
            await checkBookmarks({ userId: user, type: type, id: data.id }),
          );
        else
          setBookmarked(
            await checkBookmarks({ userId: null, type: type, id: data.id }),
          );
        // console.log(checkBookmarks({ userId: user, type: type, id: data.id }));
      }
    };
    fetch();
  }, [index, data, user]);

  const handleBookmarkAdd = () => {
    setBookmarks({ userId: user, type: type, id: data.id });
    setBookmarked(!bookmarked);
  };
  const handleBookmarkRemove = () => {
    removeBookmarks({ userId: user, type: type, id: data.id });
    setBookmarked(!bookmarked);
  };
  const handleShare = () => {
    const url = `/detail?type=${type}&id=${id}`;
    navigatorShare({ text: data.title, url: url });
  };

  return (
    // carousel
    // detail
    <div className={styles.DetailPage}>
      <div className={styles.biggerPic}>
        {
          images?.length > 0 ? (
            <Carousel
              imageArr={images}
              setIndex={setIndex}
              mobileHeight="60vh"
              desktopHeight="95vh"
              objectFit={"cover"}
            />
          ) : (
            <Skeleton className={styles.CarouselLoading} />
          ) // if no images array, then use backdrop poster
        }
        <div className={styles.curvy}></div>
        <div className={styles.curvy2}></div>
        <div className={styles.DetailBanner}>
          <div className={styles.poster}>
            <div className={styles.curvy3}></div>
            <div className={styles.curvy4}></div>
            <div
              className={styles.rating}
              data-tooltip-id="tooltip"
              data-tooltip-content={t("detail.rating")}
            >
              {data?.vote_average?.toFixed(1)}
            </div>
            <MoviePoster data={data} />
          </div>
          <div className={styles.HomeHeroMeta}>
            <h1
              data-tooltip-id="tooltip"
              data-tooltip-content={
                data?.title || data?.name || t("detail.namePlaceholder")
              }
            >
              {data?.title || data?.name || <Skeleton />}
            </h1>
            <div className={styles.HomeHeroMetaRow2}>
              <p className={styles.type}>
                {data
                  ? type == "movie"
                    ? t("media.movie")
                    : t("media.show")
                  : null}
              </p>
              {data ? (
                <>
                  <Link
                    className={styles.links}
                    data-tooltip-id="tooltip"
                    data-tooltip-content={t("detail.watchOnline")}
                    href={`${type === "movie" ? `/watch?type=${type}&id=${data?.id}` : `/watch?type=${type}&id=${data?.id}&season=1&episode=1`}`}
                  >
                    {t("detail.watch")}{" "}
                    <FaPlay className={styles.IconsMobileNone} />
                  </Link>
                  {trailer && (
                    <Link
                      className={styles.links}
                      data-tooltip-id="tooltip"
                      data-tooltip-content={t("detail.watchTrailer")}
                      href={`https://youtube.com/watch?v=${trailer.key}`}
                      target="_blank"
                    >
                      {t("detail.trailer")}{" "}
                      <FaYoutube className={styles.IconsMobileNone} />
                    </Link>
                  )}
                  {bookmarked ? (
                    <BsFillBookmarkCheckFill
                      className={styles.HomeHeroIcons}
                      onClick={handleBookmarkRemove}
                      data-tooltip-id="tooltip"
                      data-tooltip-content={t("detail.removeFromWatchlist")}
                    />
                  ) : (
                    <BsBookmarkPlus
                      className={styles.HomeHeroIcons}
                      onClick={handleBookmarkAdd}
                      data-tooltip-id="tooltip"
                      data-tooltip-content={t("detail.addToWatchlist")}
                    />
                  )}
                  <BsShare
                    className={styles.HomeHeroIcons}
                    onClick={handleShare}
                    data-tooltip-id="tooltip"
                    data-tooltip-content={t("detail.share")}
                  />
                </>
              ) : (
                <div>
                  <Skeleton width={200} count={1} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.biggerDetail}>
        <MetaDetails id={id} type={type} data={data} />
      </div>
    </div>
  );
};

export default DetailPage;
