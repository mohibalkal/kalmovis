import { useState, useEffect } from "react";
import axiosFetch from "@/Utils/fetchBackend";
import styles from "@/styles/Library.module.scss";
import MovieCardSmall from "@/components/MovieCardSmall";
import ReactPaginate from "react-paginate"; // for pagination
import { AiFillLeftCircle, AiFillRightCircle } from "react-icons/ai";
import { MdFilterAlt, MdFilterAltOff } from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import { getBookmarks, removeBookmarks, setBookmarks } from "@/Utils/bookmark";
import {
  getContinueWatching,
  removeContinueWatching,
} from "@/Utils/continueWatching";
import { BsFillBookmarkXFill } from "react-icons/bs";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/Utils/firebase";
import NProgress from "nprogress";
import { useTranslation } from "@/Utils/i18n";
// import MoviePoster from '@/components/MoviePoster';

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const dummyList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const Library = () => {
  const { t } = useTranslation();
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [importData, setImportData] = useState<string>("");
  const [category, setCategory] = useState("watchlist"); // latest, trending, topRated
  const [subCategory, setSubCategory] = useState("movie");
  const [ids, setIds] = useState<string[]>([]);
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [trigger, setTrigger] = useState(true);
  const [user, setUser] = useState<any>();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userID = user.uid;
        setUser(userID);
        // setIds(await getBookmarks(userID)?.movie)
        // setLoading(false);
      } else {
        // setLoading(true);
      }
    });
  }, []);

  useEffect(() => {
    if (loading) {
      NProgress.start();
    } else NProgress.done(false);
  }, [loading]);

  useEffect(() => {
    const fetchData = async () => {
      if (!Array.isArray(ids) || ids.length === 0) {
        setData([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      let arr: any = [];

      try {
        for (const ele of ids) {
          if (!ele) continue;

          const data = await axiosFetch({
            requestID: `${subCategory}Data`,
            id: ele,
          });

          if (data !== undefined) {
            arr.push(data);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setData(arr);
        setLoading(false);
      }
    };

    fetchData();
  }, [ids]);

  useEffect(() => {
    // fetch bookmarks
    // console.log(getBookmarks());
    const fetch = async () => {
      if (category === "watchlist") {
        if (user !== null && user !== undefined)
          getBookmarks(user).then((res: any) => {
            subCategory === "movie" ? setIds(res?.movie) : setIds(res?.tv);
          });
        else {
          subCategory === "movie"
            ? setIds(getBookmarks(null)?.movie)
            : setIds(getBookmarks(null)?.tv);
        }
      } else if (category === "continueWatching") {
        subCategory === "movie"
          ? setIds(getContinueWatching()?.movie)
          : setIds(getContinueWatching()?.tv);
      }
    };
    if (user !== null) fetch();
  }, [category, subCategory, trigger, user]);

  const handleWatchlistremove = async ({ type, id }: any) => {
    if (user !== null && user !== undefined)
      removeBookmarks({ userId: user, type: type, id: id })?.then((res): any =>
        setTimeout(() => {
          setTrigger(!trigger);
        }, 500),
      );
    else {
      removeBookmarks({ userId: null, type: type, id: id });
      setTrigger(!trigger);
    }
  };
  console.log({ ids });

  return (
    <div className={styles.MoviePage}>
      {/* if login, "hello username" */}
      {/* else, "Login to sunc to cloud" */}
      <div className={styles.header}>
        <h1>{t("library.title")}</h1>
        <div className={styles.actions}>
          <button
            className={styles.actionButton}
            onClick={() => setShowImportModal(true)}
          >
            <span>⬇️ {t("common.import")}</span>
          </button>
          <button
            className={styles.actionButton}
            onClick={() => setShowExportModal(true)}
          >
            <span>🔄 {t("common.export")}</span>
          </button>
          <button
            className={styles.actionButton}
            onClick={() => {
              if (user) {
                setLoading(true);
                // TODO: Implement cloud sync
                setTimeout(() => setLoading(false), 1000);
              }
            }}
          >
            <span>⬆️ {t("common.sync")}</span>
          </button>
        </div>
      </div>

      {showImportModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button
              className={styles.closeButton}
              onClick={() => setShowImportModal(false)}
            >
              ✕
            </button>
            <h2>{t("library.importData")}</h2>
            <p>{t("library.importInstructions")}</p>
            <p>{t("library.jsonFormatInstructions")}</p>
            <div className={styles.codeBlock}>
              <pre>{t("library.watchlist")}</pre>
              <code>{`{
  "movie": ["123"],
  "tv": ["456"],
  "manga": ["34d7df89-8a02-4dbd-9fc2-e0b0648ffcbd"]
}`}</code>
              <pre>{t("library.continueWatching")}</pre>
              <code>{`{
  "movie": [{
    "id": "123",
    "time": "1",
    "duration": "2"
  }],
  "manga": [{
    "id": "3b5c0d61-78ae-44e8-bd71-0e32e33f9a81",
    "chapter": "1d4b54c3-a6cb-4b55-bd59-7cc4e464e16f"
  }]
}`}</code>
            </div>
            <div className={styles.modalActions}>
              <button onClick={() => setShowImportModal(false)}>
                {t("common.cancel")}
              </button>
              <input
                type="file"
                accept=".json"
                style={{ display: "none" }}
                id="watchlistImport"
                onChange={async (e) => {
                  try {
                    const file = e.target.files?.[0];
                    if (file) {
                      const text = await file.text();
                      const data = JSON.parse(text);
                      if (data.movie || data.tv) {
                        if (user) {
                          // Import to cloud
                          await Promise.all([
                            data.movie &&
                              setBookmarks({
                                userId: user,
                                type: "movie",
                                ids: data.movie,
                              }),
                            data.tv &&
                              setBookmarks({
                                userId: user,
                                type: "tv",
                                ids: data.tv,
                              }),
                          ]);
                        } else {
                          // Import locally
                          if (data.movie)
                            localStorage.setItem(
                              "bookmarks_movie",
                              JSON.stringify(data.movie),
                            );
                          if (data.tv)
                            localStorage.setItem(
                              "bookmarks_tv",
                              JSON.stringify(data.tv),
                            );
                        }
                        setTrigger(!trigger);
                        setShowImportModal(false);
                      }
                    }
                  } catch (error) {
                    console.error("Invalid JSON format", error);
                  }
                }}
              />
              <button
                onClick={() => {
                  document.getElementById("watchlistImport")?.click();
                }}
              >
                {t("common.chooseFile")}
              </button>

              <input
                type="file"
                accept=".json"
                style={{ display: "none" }}
                id="continueWatchingImport"
                onChange={async (e) => {
                  try {
                    const file = e.target.files?.[0];
                    if (file) {
                      const text = await file.text();
                      const data = JSON.parse(text);
                      if (data.movie || data.tv) {
                        if (data.movie)
                          localStorage.setItem(
                            "continueWatching_movie",
                            JSON.stringify(data.movie),
                          );
                        if (data.tv)
                          localStorage.setItem(
                            "continueWatching_tv",
                            JSON.stringify(data.tv),
                          );
                        setTrigger(!trigger);
                        setShowImportModal(false);
                      }
                    }
                  } catch (error) {
                    console.error("Invalid JSON format", error);
                  }
                }}
              />
              <button
                onClick={() =>
                  document.getElementById("continueWatchingImport")?.click()
                }
              >
                {t("library.continueWatching")}
              </button>
            </div>
          </div>
        </div>
      )}

      {showExportModal && (
        <div className={styles.exportModal}>
          <div className={styles.exportModalContent}>
            <h2>{t("library.exportData")}</h2>
            <div className={styles.exportButtons}>
              <button
                onClick={() => {
                  const exportData = {
                    movie: getBookmarks(user || null)?.movie || [],
                    tv: getBookmarks(user || null)?.tv || [],
                  };
                  const dataStr = JSON.stringify(exportData, null, 2);
                  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
                  const exportFileDefaultName = "watchlist.json";
                  const linkElement = document.createElement("a");
                  linkElement.setAttribute("href", dataUri);
                  linkElement.setAttribute("download", exportFileDefaultName);
                  linkElement.click();
                  setShowExportModal(false);
                }}
              >
                {t("library.exportWatchlist")}
              </button>
              <button
                onClick={() => {
                  const exportData = {
                    movie: getContinueWatching()?.movie || [],
                    tv: getContinueWatching()?.tv || [],
                  };
                  const dataStr = JSON.stringify(exportData, null, 2);
                  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
                  const exportFileDefaultName = "continue_watching.json";
                  const linkElement = document.createElement("a");
                  linkElement.setAttribute("href", dataUri);
                  linkElement.setAttribute("download", exportFileDefaultName);
                  linkElement.click();
                  setShowExportModal(false);
                }}
              >
                {t("library.exportContinueWatching")}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.category}>
        <p
          className={`${category === "watchlist" ? styles.active : styles.inactive}`}
          onClick={() => setCategory("watchlist")}
        >
          {t("library.watchlist")}
        </p>
        <p
          className={`${category === "continueWatching" ? styles.active : styles.inactive}`}
          onClick={() => setCategory("continueWatching")}
        >
          {t("library.continueWatching")}
        </p>
        <select
          name="categoryType"
          id="categoryType"
          value={subCategory}
          onChange={(e) => setSubCategory(e.target.value)}
          className={styles.filter}
        >
          <option value="movie">{t("library.movies")}</option>
          <option value="tv">{t("library.series")}</option>
        </select>
      </div>

      <div className={styles.movieList}>
        {data?.length !== 0 && ids?.length !== 0 && ids !== undefined ? (
          data?.map((ele: any) => {
            if (category === "watchlist") {
              return (
                <div className={styles.watchlistItems}>
                  <MovieCardSmall data={ele} media_type={subCategory} />
                  <BsFillBookmarkXFill
                    className={styles.bookmarkIcon}
                    data-tooltip-id="tooltip"
                    data-tooltip-content="Remove from Watchlist"
                    onClick={() =>
                      handleWatchlistremove({ type: subCategory, id: ele?.id })
                    }
                  />
                </div>
              );
            } else
              return <MovieCardSmall data={ele} media_type={subCategory} />;
          })
        ) : ids?.length === 0 || ids === undefined ? (
          <p>List Is Empty</p>
        ) : (
          dummyList.map((ele) => <Skeleton className={styles.loading} />)
        )}
        {/* {
          (data?.length === 0 || ids?.length === 0) && dummyList.map((ele) => (
            <Skeleton className={styles.loading} />
          ))
        } */}
      </div>
    </div>
  );
};

export default Library;
