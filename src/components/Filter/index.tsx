import { useEffect, useState } from "react";
import styles from "./style.module.scss";
import axiosFetch from "@/Utils/fetchBackend";
import Skeleton from "react-loading-skeleton";
import { useTranslation } from "@/Utils/i18n";

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Function to convert genre name to translation key
function getGenreTranslationKey(genreName: string): string {
  const specialCases: { [key: string]: string } = {
    "Action & Adventure": "actionAdventure",
    "Sci-Fi & Fantasy": "sciFiFantasy",
    "War & Politics": "warPolitics",
    "Science Fiction": "scienceFiction",
    "TV Movie": "tvMovie"
  };

  // Check if it's a special case first
  if (specialCases[genreName]) {
    return specialCases[genreName];
  }

  // Otherwise, convert to camelCase
  return genreName.toLowerCase();
}

// قاموس لترجمة التصنيفات
const genreTranslations: { [key: string]: string } = {
  // تصنيفات الأفلام
  Action: "أكشن",
  Adventure: "مغامرة",
  Animation: "رسوم متحركة",
  Comedy: "كوميديا",
  Crime: "جريمة",
  Documentary: "وثائقي",
  Drama: "دراما",
  Family: "عائلي",
  Fantasy: "خيال",
  History: "تاريخي",
  Horror: "رعب",
  Music: "موسيقى",
  Mystery: "غموض",
  Romance: "رومانسي",
  "Science Fiction": "خيال علمي",
  "TV Movie": "فيلم تلفزيوني",
  Thriller: "إثارة",
  War: "حرب",
  Western: "غربي",
  
  // تصنيفات المسلسلات
  "Action & Adventure": "أكشن ومغامرة",
  Kids: "أطفال",
  News: "أخبار",
  "Sci-Fi & Fantasy": "خيال علمي وفانتازيا",
  Reality: "واقعي",
  Soap: "مسلسلات يومية",
  Talk: "برامج حوارية",
  "War & Politics": "حرب وسياسة"
};

const countryData = [
  { name: "الأرجنتين", abbr: "AR" },
  { name: "أستراليا", abbr: "AU" },
  { name: "النمسا", abbr: "AT" },
  { name: "بلجيكا", abbr: "BE" },
  { name: "البرازيل", abbr: "BR" },
  { name: "كندا", abbr: "CA" },
  { name: "الصين", abbr: "CN" },
  { name: "فرنسا", abbr: "FR" },
  { name: "ألمانيا", abbr: "DE" },
  { name: "الهند", abbr: "IN" },
  { name: "إيطاليا", abbr: "IT" },
  { name: "اليابان", abbr: "JP" },
  { name: "المكسيك", abbr: "MX" },
  { name: "هولندا", abbr: "NL" },
  { name: "روسيا", abbr: "RU" },
  { name: "كوريا الجنوبية", abbr: "KR" },
  { name: "إسبانيا", abbr: "ES" },
  { name: "السويد", abbr: "SE" },
  { name: "سويسرا", abbr: "CH" },
  { name: "تايوان", abbr: "TW" },
  { name: "المملكة المتحدة", abbr: "UK" },
  { name: "الولايات المتحدة", abbr: "US" },
  { name: "الدنمارك", abbr: "DK" },
  { name: "النرويج", abbr: "NO" },
  { name: "فنلندا", abbr: "FI" },
  { name: "البرتغال", abbr: "PT" },
  { name: "اليونان", abbr: "GR" },
  { name: "تركيا", abbr: "TR" },
  { name: "بولندا", abbr: "PL" },
  { name: "جمهورية التشيك", abbr: "CZ" },
  { name: "المجر", abbr: "HU" },
  { name: "أيرلندا", abbr: "IE" },
  { name: "نيوزيلندا", abbr: "NZ" },
  { name: "جنوب أفريقيا", abbr: "ZA" },
  { name: "مصر", abbr: "EG" },
  { name: "تايلاند", abbr: "TH" },
  { name: "سنغافورة", abbr: "SG" },
  { name: "ماليزيا", abbr: "MY" },
  { name: "الفلبين", abbr: "PH" },
  { name: "إندونيسيا", abbr: "ID" },
  { name: "فيتنام", abbr: "VN" },
  { name: "الإمارات العربية المتحدة", abbr: "AE" },
];

const Filter = ({
  categoryType,
  setShowFilter,
  setFilterYear,
  setFiltercountry,
  setFilterGenreList,
  filterGenreList,
  filterCountry,
  filterYear,
  sortBy,
  setSortBy,
  setCategory,
  setTrigger,
  trigger,
}: any) => {
  const { t } = useTranslation();
  const CapitalCategoryType = capitalizeFirstLetter(categoryType);
  const [genreData, setGenreData] = useState([]);
  const [selectedCountryCheckbox, setSelectedCountryCheckbox] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axiosFetch({
          requestID: `genres${CapitalCategoryType}`,
        });
        setGenreData(data.genres);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    setSelectedCountryCheckbox(filterCountry);
  }, []);

  const handleGenereSelect = (id: any) => {
    setFilterGenreList(
      filterGenreList === "" ? id + "," : filterGenreList + id + ",",
    );
  };

  const handleCountrySelect = (name: any) => {
    setFiltercountry(name);
    setSelectedCountryCheckbox(name);
  };

  const handleFilterSubmit = () => {
    setCategory("filter");
    setTrigger(!trigger);
    setShowFilter(false);
  };

  const handleFilterReset = () => {
    setFilterGenreList("");
    setFilterYear(undefined);
    setFiltercountry(undefined);
    setSelectedCountryCheckbox(undefined);
  };

  return (
    <div className={styles.Filter}>
      <h1>{t("filters.title")}</h1>
      <h1
        className={styles.close}
        onClick={() => {
          setShowFilter(false);
        }}
      >
        x
      </h1>

      <h2>{t("filters.categories.title")}</h2>
      {genreData.map((ele: any) => {
        const selectedGenres =
          typeof filterGenreList === "string" ? filterGenreList.split(",") : [];
        const isChecked = selectedGenres.includes(ele.id.toString());
        const translationKey = getGenreTranslationKey(ele.name);
        return (
          <div
            key={ele.id}
            className={`${styles.checkboxDiv} ${isChecked ? styles.active : styles.inactive}`}
          >
            <label className="container" htmlFor={ele.id}>
              {t(`filters.categories.${translationKey}`)}
              <input
                type="checkbox"
                id={ele.id}
                name={ele.name}
                value={ele.id}
                onChange={() => handleGenereSelect(ele.id)}
                checked={isChecked}
              />
              <span className="checkmark"></span>
            </label>
          </div>
        );
      })}
      {genreData?.length === 0 && (
        <Skeleton count={7} style={{ margin: "0.2rem 0", padding: "0.5rem" }} />
      )}

      <h2>{t("filters.sort.title")}</h2>
      <select
        name="source"
        id="source"
        className={styles.source}
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="popularity.desc">{t("filters.sort.latest")}</option>
        <option value="popularity.asc">{t("filters.sort.oldest")}</option>
        <option value="vote_average.desc">{t("filters.sort.topRated")}</option>
        <option value="vote_average.asc">
          {t("filters.sort.alphabetical")}
        </option>
      </select>

      <div className={styles.filterButtons}>
        <button onClick={handleFilterReset} className={styles.reset}>
          {t("filters.reset")}
        </button>
        <button onClick={handleFilterSubmit} className={styles.submit}>
          {t("filters.apply")}
        </button>
      </div>
    </div>
  );
};

export default Filter;
