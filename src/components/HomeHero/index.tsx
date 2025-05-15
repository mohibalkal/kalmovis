import React, { useState, useEffect } from "react";
import styles from "./style.module.scss";
import axiosFetch from "@/Utils/fetchBackend";
import "react-loading-skeleton/dist/skeleton.css";
// import Image from "next/image";
import Carousel from "../Carousel";
import Link from "next/link";
import {
  BsBookmarkPlus,
  BsFillBookmarkCheckFill,
  BsShare,
} from "react-icons/bs";
import { FaInfo, FaPlay } from "react-icons/fa";
import {
  setBookmarks,
  checkBookmarks,
  removeBookmarks,
  getBookmarks,
} from "@/Utils/bookmark";
import { navigatorShare } from "@/Utils/share";
import Skeleton from "react-loading-skeleton";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/Utils/firebase";
import { useTranslation } from "@/Utils/i18n";

const externalImageLoader = ({ src }: { src: string }) =>
  `${process.env.NEXT_PUBLIC_TMBD_IMAGE_URL}${src}`;

const HomeHero = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<any>([]);
  const [images, setImages] = useState<any>([]);
  const [loading, setLoading] = useState<any>(true);
  const [index, setIndex] = useState(0);
  const [bookmarked, setBookmarked] = useState<any>(false);
  const [user, setUser] = useState<any>();
  const [bookmarkList, setBookmarkList] = useState<any>();
  console.log({ index });
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await axiosFetch({ requestID: "trending" });
        if (response && response.results) {
          const initialItems = response.results.slice(0, 5);
          setData(initialItems);
          let arr: any = [];
          initialItems.forEach((ele: any) => {
            if (ele.backdrop_path) {
              arr.push(
                process.env.NEXT_PUBLIC_TMBD_IMAGE_URL + ele.backdrop_path,
              );
            } else {
              arr.push("/images/logo.svg");
            }
          });
          setImages(arr);
        } else {
          setImages(["/images/logo.svg"]);
          setData([]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setImages(["/images/logo.svg"]);
        setData([]);
        setLoading(false);
      }
    };
    fetchData();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userID = user.uid;
        setUser(userID);
        // setBookmarkList(await getBookmarks({ userId: userID }));
        // setBookmarkList(getBookmarks(userID));
        setLoading(false);
      } else {
        setLoading(true);
      }
    });
  }, []);

  useEffect(() => {
    const check = async () => {
      if (data[index] !== undefined && data[index] !== null) {
        setBookmarked(
          await checkBookmarks({
            userId: user,
            type: data[index].media_type,
            id: data[index].id,
          }),
        );
      }
    };
    if (data?.length > 0) check();
  }, [index, data, user]);

  const handleBookmarkAdd = () => {
    console.log({ user });

    setBookmarks({
      userId: user,
      type: data[index]?.media_type,
      id: data[index].id,
    });
    setBookmarked(!bookmarked);
  };
  const handleBookmarkRemove = () => {
    removeBookmarks({
      userId: user,
      type: data[index]?.media_type,
      id: data[index].id,
    });
    setBookmarked(!bookmarked);
  };
  const handleShare = () => {
    const url = `/detail?type=${data[index].media_type}&id=${data[index].id}`;
    navigatorShare({ text: data[index].title, url: url });
  };
  return (
    <div className={styles.HomeHero}>
      <div className={styles.HomeCarousel}>
        {images.length > 0 ? (
          <Carousel
            imageArr={images}
            setIndex={setIndex}
            mobileHeight="60vh"
            desktopHeight="80vh"
            objectFit={"cover"}
          />
        ) : (
          <Skeleton className={styles.CarouselLoading} />
        )}
        <div className={styles.curvy}></div>
        <div className={styles.curvy2}></div>
        <div className={styles.curvy3}></div>
        <div className={styles.curvy4}></div>
        <div className={styles.HomeHeroMeta}>
          <h1
            data-tooltip-id="tooltip"
            data-tooltip-content={
              data[index]?.title || data[index]?.name || t("common.loading")
            }
          >
            {data[index]?.title || data[index]?.name || <Skeleton />}
          </h1>
          <div className={styles.HomeHeroMetaRow2}>
            <p className={styles.type}>
              {data[index] ? (
                data[index].media_type == "movie" ? (
                  t("media.type.movie")
                ) : (
                  t("media.type.show")
                )
              ) : (
                <Skeleton />
              )}
            </p>
            {data[index] ? (
              <>
                <Link
                  className={styles.links}
                  href={`${data[index]?.media_type === "movie" ? `/watch?type=${data[index]?.media_type}&id=${data[index]?.id}` : `/watch?type=${data[index]?.media_type}&id=${data[index]?.id}&season=1&episode=1`}`}
                  data-tooltip-id="tooltip"
                  data-tooltip-content={t("media.watchNow")}
                >
                  {t("media.watch")} <FaPlay />
                </Link>
                <Link
                  className={styles.links}
                  href={`/detail?type=${data[index]?.media_type}&id=${data[index]?.id}`}
                  data-tooltip-id="tooltip"
                  data-tooltip-content={t("media.details")}
                >
                  {t("media.details")}
                </Link>

                {bookmarked ? (
                  <BsFillBookmarkCheckFill
                    className={styles.HomeHeroIcons}
                    onClick={handleBookmarkRemove}
                    data-tooltip-id="tooltip"
                    data-tooltip-content={t("media.removeFromWatchlist")}
                  />
                ) : (
                  <BsBookmarkPlus
                    className={styles.HomeHeroIcons}
                    onClick={handleBookmarkAdd}
                    data-tooltip-id="tooltip"
                    data-tooltip-content={t("media.addToWatchlist")}
                  />
                )}
                <BsShare
                  className={styles.HomeHeroIcons}
                  onClick={handleShare}
                  data-tooltip-id="tooltip"
                  data-tooltip-content={t("common.share")}
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
  );
};

export default HomeHero;
