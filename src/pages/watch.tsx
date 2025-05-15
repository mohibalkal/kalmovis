import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const vidsrcTo = "https://vidsrc.to";
const embedSu = "https://embed.su";
const vidsrcXyz = "https://vidsrc.xyz";
const vidsrcPro = "https://vidsrc.me";
const vidlinkPro = "https://vidlink.pro";
const vidsrcCc = "https://vidsrc.cc/v2";
const nunflixPlayer = "https://111movies.com";
const vidFastPro = "https://vidfast.pro";
const vidZeeWtf = "https://vidzee.wtf";
const embedSuPro = "https://embed.su";
const riveStream = "https://rivestream.pages.dev";
import styles from "@/styles/Watch.module.scss";
import { setContinueWatching } from "@/Utils/continueWatching";
import { toast } from "sonner";
import { IoEyeOff, IoEye, IoReturnDownBack } from "react-icons/io5";
import { FaForwardStep, FaBackwardStep } from "react-icons/fa6";
import { BsHddStack, BsHddStackFill } from "react-icons/bs";
import axiosFetch from "@/Utils/fetchBackend";
import WatchDetails from "@/components/WatchDetails";

const Watch = () => {
  const params = useSearchParams();
  const { back, push } = useRouter();
  // console.log(params.get("id"));
  const [type, setType] = useState<string | null>("");
  const [id, setId] = useState<any>();
  const [season, setSeason] = useState<any>();
  const [episode, setEpisode] = useState<any>();
  const [minEpisodes, setMinEpisodes] = useState(1);
  const [maxEpisodes, setMaxEpisodes] = useState(2);
  const [maxSeason, setMaxSeason] = useState(1);
  const [nextSeasonMinEpisodes, setNextSeasonMinEpisodes] = useState(1);
  const [loading, setLoading] = useState(true);
  const [watchDetails, setWatchDetails] = useState(false);
  const [data, setdata] = useState<any>();
  const [source, setSource] = useState("EMBEDSU");
  const [embedMode, setEmbedMode] = useState("embed");
  const [showControls, setShowControls] = useState(true);
  const nextBtn: any = useRef(null);
  const backBtn: any = useRef(null);
  const moreBtn: any = useRef(null);
  if (params && type === null && params.get("id") !== null)
    setType(params.get("type"));
  if (params && id === null && params.get("id") !== null)
    setId(params.get("id"));
  if (params && season === null && params.get("season") !== null)
    setSeason(params.get("season"));
  if (params && episode === null && params.get("episode") !== null)
    setEpisode(params.get("episode"));

  useEffect(() => {
    setLoading(true);
    if (params) {
      setType(params.get("type"));
      setId(params.get("id"));
      setSeason(params.get("season"));
      setEpisode(params.get("episode"));
      setContinueWatching({ type: params.get("type"), id: params.get("id") });
    }
    const fetch = async () => {
      const res: any = await axiosFetch({ requestID: `${type}Data`, id: id });
      setdata(res);
      setMaxSeason(res?.number_of_seasons);
      const seasonData = await axiosFetch({
        requestID: `tvEpisodes`,
        id: id,
        season: season,
      });
      seasonData?.episodes?.length > 0 &&
        setMaxEpisodes(
          seasonData?.episodes[seasonData?.episodes?.length - 1]
            ?.episode_number,
        );
      setMinEpisodes(seasonData?.episodes[0]?.episode_number);
      if (parseInt(episode) >= maxEpisodes - 1) {
        var nextseasonData = await axiosFetch({
          requestID: `tvEpisodes`,
          id: id,
          season: parseInt(season) + 1,
        });
        nextseasonData?.episodes?.length > 0 &&
          setNextSeasonMinEpisodes(nextseasonData?.episodes[0]?.episode_number);
      }
    };
    if (type === "tv") fetch();

    const handleKeyDown = (event: any) => {
      if (event.shiftKey && event.key === "N") {
        event.preventDefault();
        nextBtn?.current.click();
      } else if (event.shiftKey && event.key === "P") {
        event.preventDefault();
        backBtn?.current.click();
      } else if (event.shiftKey && event.key === "M") {
        event.preventDefault();
        moreBtn?.current.click();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [params, id, season, episode]);

  useEffect(() => {
    // Add VidZee progress tracking
    const handleVidZeeMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://vidzee.wtf') return;
      
      if (event.data?.type === 'MEDIA_DATA') {
        const mediaData = event.data.data;
        localStorage.setItem('vidZeeProgress', JSON.stringify(mediaData));
      }
    };

    window.addEventListener('message', handleVidZeeMessage);
    return () => {
      window.removeEventListener('message', handleVidZeeMessage);
    };
  }, []);

  function handleBackward() {
    // setEpisode(parseInt(episode)+1);
    if (episode > minEpisodes)
      push(
        `/watch?type=tv&id=${id}&season=${season}&episode=${parseInt(episode) - 1}`,
      );
  }
  function handleForward() {
    // setEpisode(parseInt(episode)+1);
    if (episode < maxEpisodes)
      push(
        `/watch?type=tv&id=${id}&season=${season}&episode=${parseInt(episode) + 1}`,
      );
    else if (parseInt(season) + 1 <= maxSeason)
      push(
        `/watch?type=tv&id=${id}&season=${parseInt(season) + 1}&episode=${nextSeasonMinEpisodes}`,
      );
  }

  const STREAM_URL_AGG = process.env.NEXT_PUBLIC_STREAM_URL_AGG;
  const STREAM_URL_VID = process.env.NEXT_PUBLIC_STREAM_URL_VID;
  const STREAM_URL_PRO = process.env.NEXT_PUBLIC_STREAM_URL_PRO;
  const STREAM_URL_SUPER = process.env.NEXT_PUBLIC_STREAM_URL_SUPER;

  return (
    <div className={styles.watch}>
      <div onClick={() => back()} className={styles.backBtn}>
        <IoReturnDownBack
          data-tooltip-id="tooltip"
          data-tooltip-content="go back"
        />
      </div>
      {
        <div className={styles.episodeControl}>
          {type === "tv" ? (
            <>
              <div
                ref={backBtn}
                onClick={() => {
                  if (episode > 1) handleBackward();
                }}
                data-tooltip-id="tooltip"
                data-tooltip-html={
                  episode > minEpisodes
                    ? "<div>Previous episode <span class='tooltip-btn'>SHIFT + P</span></div>"
                    : `Start of season ${season}`
                }
              >
                <FaBackwardStep
                  className={`${episode <= minEpisodes ? styles.inactive : null}`}
                />
              </div>
              <div
                ref={nextBtn}
                onClick={() => {
                  if (
                    episode < maxEpisodes ||
                    parseInt(season) + 1 <= maxSeason
                  )
                    handleForward();
                }}
                data-tooltip-id="tooltip"
                data-tooltip-html={
                  episode < maxEpisodes
                    ? "<div>Next episode <span class='tooltip-btn'>SHIFT + N</span></div>"
                    : parseInt(season) + 1 <= maxSeason
                      ? `<div>Start season ${parseInt(season) + 1} <span class='tooltip-btn'>SHIFT + N</span></div>`
                      : `End of season ${season}`
                }
              >
                <FaForwardStep
                  className={`${episode >= maxEpisodes && season >= maxSeason ? styles.inactive : null} ${episode >= maxEpisodes && season < maxSeason ? styles.nextSeason : null}`}
                />
              </div>
            </>
          ) : null}
          <div
            ref={moreBtn}
            onClick={() => setWatchDetails(!watchDetails)}
            data-tooltip-id="tooltip"
            data-tooltip-html={
              !watchDetails
                ? "More <span class='tooltip-btn'>SHIFT + M</span></div>"
                : "close <span class='tooltip-btn'>SHIFT + M</span></div>"
            }
          >
            {watchDetails ? <BsHddStackFill /> : <BsHddStack />}
          </div>
        </div>
      }
      {watchDetails && (
        <WatchDetails
          id={id}
          type={type}
          data={data}
          season={season}
          episode={episode}
          setWatchDetails={setWatchDetails}
        />
      )}
      <div
        className={`${styles.centerControls} ${!showControls ? styles.hidden : ""}`}
      >
        <select
          name="source"
          id="source"
          className={styles.source}
          value={source}
          onChange={(e) => setSource(e.target.value)}
        >
          {embedMode === "embed" ? (
            <>
              <option value="EMBEDSU">1 : Embed.su (Ultra/Multi) ✦</option>
              <option value="VIDFAST">2 : VidFast Pro (HD/No-Ads) ✦</option>
              <option value="VIDZEE">3 : VidZee (Ultra/4K) ✦</option>
              <option value="AGG">4 : Aggregator (Multi-Server)</option>
              <option value="VID">5 : Aggregator (VidSrcMe) ✦</option>
              <option value="WEB">6 : Aggregator (111Movies) ✦</option>
              <option value="STREAM">7 : Aggregator (VidLink) ✦</option>
              <option value="FLIX">8 : Aggregator (VidSrc.cc) ✦</option>
              <option value="RAPID">9 : Aggregator (VidSrc.to) ✦</option>
              <option value="INDIA">10 : Aggregator (Embed.su) ✦</option>
              <option value="FASTX">11 : Fastx (HLS)</option>
            </>
          ) : (
            <>
              <option value="ALKAL">Alkal (Official)</option>
            </>
          )}
        </select>

        <select
          className={styles.source}
          value={embedMode}
          onChange={(e) => {
            setEmbedMode(e.target.value);
            if (e.target.value === "non-embed") {
              setSource("ALKAL");
            } else {
              setSource("AGG");
            }
          }}
        >
          <option value="embed">Embed Mode</option>
          <option value="non-embed">NON Embed Mode (AD-free)</option>
        </select>
      </div>
      <button
        className={styles.iconButton}
        onClick={() => setShowControls(!showControls)}
      >
        {showControls ? <IoEyeOff /> : <IoEye />}
      </button>
      <div className={`${styles.loader} skeleton`}></div>

      {source === "AGG" && id !== "" && id !== null ? (
        <iframe
          src={
            type === "movie"
              ? `${vidsrcTo}/embed/movie/${id}`
              : `${vidsrcTo}/embed/tv/${id}/${season}/${episode}`
          }
          className={styles.iframe}
          allowFullScreen
          allow="accelerometer; autoplay; encrypted-media; gyroscope;"
          referrerPolicy="origin"
        ></iframe>
      ) : null}

      {source === "VID" && id !== "" && id !== null ? (
        <iframe
          src={
            type === "movie"
              ? `${vidsrcXyz}/embed/movie/${id}`
              : `${vidsrcXyz}/embed/tv/${id}/${season}/${episode}`
          }
          className={styles.iframe}
          allowFullScreen
          allow="accelerometer; autoplay; encrypted-media; gyroscope;"
          referrerPolicy="origin"
        ></iframe>
      ) : null}

      {source === "PRO" && id !== "" && id !== null ? (
        <iframe
          src={
            type === "movie"
              ? `${vidsrcPro}/embed/movie/${id}`
              : `${vidsrcPro}/embed/tv/${id}/${season}/${episode}`
          }
          className={styles.iframe}
          allowFullScreen
          allow="accelerometer; autoplay; encrypted-media; gyroscope;"
          referrerPolicy="origin"
        ></iframe>
      ) : null}

      {source === "WEB" && id !== "" && id !== null ? (
        <iframe
          src={
            type === "movie"
              ? `${nunflixPlayer}/movie/${id}`
              : `${nunflixPlayer}/tv/${id}/${season}/${episode}`
          }
          className={styles.iframe}
          allowFullScreen
          allow="accelerometer; autoplay; encrypted-media; gyroscope;"
          referrerPolicy="origin"
        ></iframe>
      ) : null}

      {source === "STREAM" && id !== "" && id !== null ? (
        <iframe
          src={
            type === "movie"
              ? `${vidlinkPro}/movie/${id}`
              : `${vidlinkPro}/tv/${id}/${season}/${episode}`
          }
          className={styles.iframe}
          allowFullScreen
          allow="accelerometer; autoplay; encrypted-media; gyroscope;"
          referrerPolicy="origin"
        ></iframe>
      ) : null}

      {source === "FLIX" && id !== "" && id !== null ? (
        <iframe
          src={
            type === "movie"
              ? `${vidsrcCc}/embed/movie/${id}`
              : `${vidsrcCc}/embed/tv/${id}/${season}/${episode}`
          }
          className={styles.iframe}
          allowFullScreen
          allow="accelerometer; autoplay; encrypted-media; gyroscope;"
          referrerPolicy="origin"
        ></iframe>
      ) : null}

      {source === "RAPID" && id !== "" && id !== null ? (
        <iframe
          src={
            type === "movie"
              ? `${vidsrcTo}/embed/movie/${id}`
              : `${vidsrcTo}/embed/tv/${id}/${season}/${episode}`
          }
          className={styles.iframe}
          allowFullScreen
          allow="accelerometer; autoplay; encrypted-media; gyroscope;"
          referrerPolicy="origin"
        ></iframe>
      ) : null}

      {source === "INDIA" && id !== "" && id !== null ? (
        <iframe
          src={
            type === "movie"
              ? `${embedSu}/embed/movie/${id}`
              : `${embedSu}/embed/tv/${id}/${season}/${episode}`
          }
          className={styles.iframe}
          allowFullScreen
          allow="accelerometer; autoplay; encrypted-media; gyroscope;"
          referrerPolicy="origin"
        ></iframe>
      ) : null}

      {source === "VIDFAST" && id !== "" && id !== null ? (
        <iframe
          src={
            type === "movie"
              ? `${vidFastPro}/movie/${id}?autoPlay=true`
              : `${vidFastPro}/tv/${id}/${season}/${episode}?autoPlay=true`
          }
          className={styles.iframe}
          allowFullScreen
          allow="accelerometer; autoplay; encrypted-media; gyroscope;"
          referrerPolicy="origin"
        ></iframe>
      ) : null}

      {source === "VIDZEE" && id !== "" && id !== null ? (
        <iframe
          src={
            type === "movie"
              ? `${vidZeeWtf}/movie/${id}`
              : `${vidZeeWtf}/tv/${id}/${season}/${episode}`
          }
          className={styles.iframe}
          allowFullScreen
          allow="accelerometer; autoplay; encrypted-media; gyroscope;"
          referrerPolicy="origin"
        ></iframe>
      ) : null}

      {source === "EMBEDSU" && id !== "" && id !== null ? (
        <iframe
          src={
            type === "movie"
              ? `${embedSuPro}/embed/movie/${id}`
              : `${embedSuPro}/embed/tv/${id}/${season}/${episode}`
          }
          className={styles.iframe}
          allowFullScreen
          allow="accelerometer; autoplay; encrypted-media; gyroscope;"
          referrerPolicy="origin"
        ></iframe>
      ) : null}

      {source === "FASTX" && id !== "" && id !== null ? (
        <iframe
          src={
            type === "movie"
              ? `${riveStream}/download?type=movie&id=${id}`
              : `${riveStream}/download?type=tv&id=${id}&season=${season}&episode=${episode}`
          }
          className={styles.iframe}
          allowFullScreen
          allow="accelerometer; autoplay; encrypted-media; gyroscope;"
          referrerPolicy="origin"
        ></iframe>
      ) : null}

      {embedMode === "non-embed" && source === "ALKAL" && id && (
        <iframe
          src={
            type === "movie"
              ? `https://alkal-api.netlify.app/embed/${id}`
              : `https://alkal-api.netlify.app/embed/${id}/${season}/${episode}`
          }
          className={styles.iframe}
          allowFullScreen
          allow="accelerometer; autoplay; encrypted-media; gyroscope;"
          referrerPolicy="origin"
        ></iframe>
      )}
    </div>
  );
};

export default Watch;
