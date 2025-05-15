import React, { useState, useEffect } from "react";
import styles from "./style.module.scss";
import Link from "next/link";
// import {
//   AiFillHome,
//   AiOutlineHome,
//   AiFillPlayCircle,
//   AiOutlinePlayCircle,
// } from "react-icons/ai";
// import {
//   IoLibrary,
//   IoLibraryOutline,
//   IoSettings,
//   IoSettingsOutline,
//   IoSearchOutline,
//   IoSearch,
// } from "react-icons/io5";
// import { PiTelevisionFill, PiTelevisionLight } from "react-icons/pi";

import { IoLibrary, IoLibraryOutline } from "react-icons/io5";
import {
  MdOutlineCollectionsBookmark,
  MdCollectionsBookmark,
  MdHome,
  MdOutlineHome,
  MdPlayCircle,
  MdOutlinePlayCircle,
  MdSearch,
  MdOutlineSearch,
  MdSettings,
  MdOutlineSettings,
  MdTv,
  MdOutlineTv,
  MdTheaterComedy,
  MdOutlineTheaterComedy,
} from "react-icons/md";
import { RiEye2Line, RiEye2Fill } from "react-icons/ri";
import { usePathname, useSearchParams } from "next/navigation";
import { useTranslation } from "@/Utils/i18n";

const Navbar = ({ children }: any) => {
  const { t } = useTranslation();
  const path = usePathname();
  const params = useSearchParams();
  // const query=
  const [pathname, setPathname] = useState(path);
  useEffect(() => {
    const type = params?.get("type");
    if (type !== null) setPathname("/" + type);
    else {
      const arr = path?.split("/");
      setPathname("/" + arr?.[1]);
    }
  }, [path, params]);
  return (
    <div className={styles.navbar}>
      <Link
        href="/"
        aria-label={t("navigation.home")}
        data-tooltip-id="tooltip"
        data-tooltip-content={t("navigation.home")}
      >
        {pathname === "/" ? (
          <MdHome className={styles.active} />
        ) : (
          <MdOutlineHome className={styles.inactive} />
        )}
      </Link>
      <Link
        href="/search"
        aria-label={t("common.search")}
        data-tooltip-id="tooltip"
        data-tooltip-html={`<div>${t("common.search")} <span class='tooltip-btn'>CTRL + K</span></div>`}
      >
        {pathname === "/search" ? (
          <MdSearch className={styles.active} />
        ) : (
          <MdOutlineSearch className={styles.inactive} />
        )}
      </Link>
      <Link
        href="/movie"
        aria-label={t("navigation.movies")}
        data-tooltip-id="tooltip"
        data-tooltip-content={t("navigation.movies")}
      >
        {pathname === "/movie" ? (
          <MdPlayCircle className={styles.active} />
        ) : (
          <MdOutlinePlayCircle className={styles.inactive} />
        )}
      </Link>
      <Link
        href="/tv"
        aria-label={t("navigation.series")}
        data-tooltip-id="tooltip"
        data-tooltip-content={t("navigation.series")}
      >
        {pathname === "/tv" ? (
          <MdTv className={styles.active} />
        ) : (
          <MdOutlineTv className={styles.inactive} />
        )}
      </Link>
      <Link
        href="/anime"
        aria-label={t("navigation.anime")}
        data-tooltip-id="tooltip"
        data-tooltip-content={t("navigation.anime")}
        className={styles.mobileHide}
      >
        {pathname === "/anime" ? (
          <RiEye2Fill className={styles.active} />
        ) : (
          <RiEye2Line className={styles.inactive} />
        )}
      </Link>
      <Link
        href="/kdrama"
        aria-label={t("navigation.kdrama")}
        data-tooltip-id="tooltip"
        data-tooltip-content={t("navigation.kdrama")}
        className={styles.mobileHide}
      >
        {pathname === "/kdrama" ? (
          <MdTheaterComedy className={styles.active} />
        ) : (
          <MdOutlineTheaterComedy className={styles.inactive} />
        )}
      </Link>
      <Link
        href="/collections"
        aria-label={t("navigation.collections")}
        data-tooltip-id="tooltip"
        data-tooltip-content={t("navigation.collections")}
      >
        {pathname === "/collections" ? (
          <MdCollectionsBookmark className={styles.active} />
        ) : (
          <MdOutlineCollectionsBookmark className={styles.inactive} />
        )}
      </Link>
      <Link
        href="/library"
        aria-label={t("navigation.library")}
        data-tooltip-id="tooltip"
        data-tooltip-content={t("navigation.library")}
      >
        {pathname === "/library" ? (
          <IoLibrary className={styles.active} />
        ) : (
          <IoLibraryOutline className={styles.inactive} />
        )}
      </Link>
      <Link
        href="/settings"
        aria-label={t("navigation.settings")}
        data-tooltip-id="tooltip"
        data-tooltip-content={t("navigation.settings")}
      >
        {pathname === "/settings" ||
        pathname === "/downloads" ||
        pathname === "/disclaimer" ||
        pathname === "/signup" ||
        pathname === "/login" ? (
          <MdSettings className={styles.active} />
        ) : (
          <MdOutlineSettings className={styles.inactive} />
        )}
      </Link>
    </div>
  );
};

export default Navbar;
