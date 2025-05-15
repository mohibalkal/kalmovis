// Core imports
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// UI Components and Styles
import styles from "@/styles/Settings.module.scss";
import { FaGithub, FaGlobe, FaDiscord } from "react-icons/fa";

// Utils and Services
import { getSettings, setSettings } from "@/Utils/settings";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/Utils/firebase";
import { logoutUser } from "@/Utils/firebaseUser";
import { useTranslation, languages } from "@/Utils/i18n";

/**
 * Clears user data based on the specified type
 * @param {string} type - Type of data to clear (e.g., 'cache', 'cookies')
 */
const clearData = (type: string) => {
  // Add clear data functionality based on type
  console.log(`Clearing ${type} data...`);
  // TODO: Implement actual data clearing logic
};

// Type definitions for settings
interface SubtitleSettings {
  fontFamily: string;
  fontSize: string;
  fontColor: string;
  backgroundColor: string;
  backgroundBlur: string;
  opacity: string;
  margin: string;
}

// Default subtitle settings
const defaultSubtitleSettings: SubtitleSettings = {
  fontFamily: "System UI",
  fontSize: "100%",
  fontColor: "White",
  backgroundColor: "Transparent",
  backgroundBlur: "0%",
  opacity: "100%",
  margin: "0%",
};

/**
 * SettingsPage Component
 *
 * A comprehensive settings page that allows users to customize their experience.
 * Includes settings for account, appearance, subtitles, player, developer options,
 * and miscellaneous settings.
 *
 * @param props - Component props including mode, theme, accent color and their setters
 */
interface SettingsPageProps {
  /** Current display mode (system, light, dark) */
  mode: string;
  /** Current theme */
  theme: string;
  /** Current accent color */
  ascent_color: string;
  /** Current system font */
  system_font: string;
  /** Function to update display mode */
  setMode: (mode: string) => void;
  /** Function to update theme */
  setTheme: (theme: string) => void;
  /** Function to update accent color */
  setAscent_color: (color: string) => void;
  /** Function to update system font */
  setSystem_font: (font: string) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({
  mode,
  theme,
  ascent_color,
  system_font,
  setMode,
  setTheme,
  setAscent_color,
  setSystem_font,
}) => {
  const [user, setUser] = useState<any>(false);
  const [loading, setLoading] = useState(true);
  const { t, language, setLanguage } = useTranslation();
  const { push } = useRouter();
  const [subtitleSettings, setSubtitleSettings] = useState<SubtitleSettings>(
    () => {
      // Load saved settings on component mount
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('subtitleSettings');
        return saved ? JSON.parse(saved) : defaultSubtitleSettings;
      }
      return defaultSubtitleSettings;
    }
  );

  // Authentication effect
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        setUser(false);
        setLoading(false);
      }
    });
  }, []);

  // Apply theme effect
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  // Load settings on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('subtitleSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setSubtitleSettings(settings);
      applyTextSettings(settings);
    } else {
      applyTextSettings(defaultSubtitleSettings);
    }
  }, []);

  // Function to apply text settings
  const applyTextSettings = (settings: SubtitleSettings) => {
    const fontScale = parseFloat(settings.fontSize) / 100;
    
    document.documentElement.style.setProperty('--text-fontFamily', settings.fontFamily);
    document.documentElement.style.setProperty('--text-scale', fontScale.toString());
    document.documentElement.style.setProperty('--text-fontColor', settings.fontColor.toLowerCase());
    document.documentElement.style.setProperty('--text-backgroundColor', settings.backgroundColor.toLowerCase());
  };

  // Save and apply settings whenever they change
  useEffect(() => {
    localStorage.setItem('subtitleSettings', JSON.stringify(subtitleSettings));
    applyTextSettings(subtitleSettings);
  }, [subtitleSettings]);

  // Handle settings change
  const handleSubtitleChange = (key: keyof SubtitleSettings, value: string) => {
    setSubtitleSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  interface SelectParams {
    type: "mode" | "theme" | "ascent_color" | "system_font";
    value: string;
  }

  /**
   * Handles changes to select inputs and updates settings accordingly
   * @param {SelectParams} params - Object containing type and value of the setting
   */
  const handleSelect = ({ type, value }: SelectParams) => {
    const prevVal = { mode, theme, ascent_color, system_font };
    if (type === "mode") {
      setSettings({ values: { ...prevVal, mode: value } });
      document.documentElement.setAttribute("data-theme", value);
    } else if (type === "theme") {
      setSettings({ values: { ...prevVal, theme: value } });
    } else if (type === "ascent_color") {
      setSettings({ values: { ...prevVal, ascent_color: value } });
    } else if (type === "system_font") {
      setSettings({ values: { ...prevVal, system_font: value } });
      document.documentElement.style.setProperty("--system-font", value);
    }
  };

  // Render component
  return (
    <div className={`${styles.settingsPage} ${styles.authPage}`}>
      <div className={styles.logo}>
        <img src="/images/logo.svg" alt="logo" />
        <p>Your Personal Streaming Oasis</p>
      </div>
      <div className={styles.settings}>
        <h1>{t("settings.account.title")}</h1>
        {user ? (
          <div className={styles.group}>
            <>
              <p className={styles.logout} onClick={() => logoutUser()}>
                {t("settings.account.logout")}
              </p>
            </>
            <h4 className={styles.profileCard}>Hi There!</h4>
          </div>
        ) : (
          <div className={styles.group}>
            <>
              <Link href="/login">{t("settings.account.login")}</Link>
              <Link href="/signup">{t("settings.account.signup")}</Link>
            </>
            <Link href="/login" className={styles.syncButton}>
              {t("settings.account.syncCloud")}
            </Link>
          </div>
        )}

        <h1>{t("settings.appearance.title")}</h1>
        <div className={styles.group}>
          <div>
            <label htmlFor="mode">{t("settings.appearance.mode")}</label>
            <select
              name="mode"
              id="mode"
              value={mode}
              onChange={(e) => {
                setMode(e.target.value);
                handleSelect({ type: "mode", value: e.target.value });
              }}
            >
              <option value="system">
                {t("settings.appearance.modes.system")}
              </option>
              <option value="light">
                {t("settings.appearance.modes.light")}
              </option>
              <option value="dark">
                {t("settings.appearance.modes.dark")}
              </option>
              <option value="charcoal">
                {t("settings.appearance.modes.charcoal")}
              </option>
              <option value="evergreen">
                {t("settings.appearance.modes.evergreen")}
              </option>
              <option value="midnight">
                {t("settings.appearance.modes.midnight")}
              </option>
              <option value="aurora">
                {t("settings.appearance.modes.aurora")}
              </option>
              <option value="obsidian">
                {t("settings.appearance.modes.obsidian")}
              </option>
              <option value="oyster">
                {t("settings.appearance.modes.oyster")}
              </option>
              <option value="arctic">
                {t("settings.appearance.modes.arctic")}
              </option>
              <option value="burgundy">
                {t("settings.appearance.modes.burgundy")}
              </option>
            </select>
          </div>
          <div>
            <label htmlFor="language">{t("settings.account.language")}</label>
            <select
              name="language"
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={styles.source}
            >
              {Object.entries(languages).map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="accent-color">
              {t("settings.appearance.accentColor")}
            </label>
            <select
              name="accent-color"
              id="accent-color"
              value={ascent_color}
              onChange={(e) => {
                setAscent_color(e.target.value);
                handleSelect({ type: "ascent_color", value: e.target.value });
              }}
            >
              <option value="blue">
                {t("settings.appearance.colors.blue")}
              </option>
              <option value="red">{t("settings.appearance.colors.red")}</option>
              <option value="green">
                {t("settings.appearance.colors.green")}
              </option>
              <option value="purple">
                {t("settings.appearance.colors.purple")}
              </option>
              <option value="orange">
                {t("settings.appearance.colors.orange")}
              </option>
              <option value="pink">
                {t("settings.appearance.colors.pink")}
              </option>
              <option value="teal">
                {t("settings.appearance.colors.teal")}
              </option>
              <option value="indigo">
                {t("settings.appearance.colors.indigo")}
              </option>
              <option value="amber">
                {t("settings.appearance.colors.amber")}
              </option>
              <option value="cyan">
                {t("settings.appearance.colors.cyan")}
              </option>
            </select>
          </div>
          <div>
            <label htmlFor="system-font">
              {t("settings.appearance.systemFont")}
            </label>
            <select
              name="system-font"
              id="system-font"
              value={system_font}
              onChange={(e) => {
                setSystem_font(e.target.value);
                handleSelect({ type: "system_font", value: e.target.value });
              }}
            >
              <option value="Oswald">Oswald (Bold)</option>
              <option value="Roboto Condensed">Roboto Condensed (Bold)</option>
              <option value="Lato">Lato (Bold)</option>
              <option value="Montserrat">Montserrat (Bold)</option>
              <option value="Open Sans">Open Sans (Bold)</option>
              <option value="Poppins">Poppins (Bold)</option>
              <option value="Raleway">Raleway (Bold)</option>
              <option value="Ubuntu">Ubuntu (Bold)</option>
              <option value="Inter">Inter</option>
              <option value="Abel">Abel</option>
              <option value="Quicksand">Quicksand</option>
              <option value="Nunito">Nunito</option>
              <option value="Source Sans 3">Source Sans 3</option>
              <option value="Space Grotesk">Space Grotesk</option>
              <option value="DM Sans">DM Sans</option>
              <option value="System UI">System UI</option>
            </select>
          </div>
        </div>

        <h1><span>{t("settings.subtitles.title")}</span></h1>
        <div className={styles.group}>
          <div>
            <label><span>{t("settings.subtitles.fontFamily")}</span></label>
            <select
              name="subtitle-font"
              id="subtitle-font"
              value={subtitleSettings.fontFamily}
              onChange={(e) => handleSubtitleChange('fontFamily', e.target.value)}
            >
              <option value="System UI"><span>{t("settings.system.ui")}</span></option>
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Courier New">Courier New</option>
            </select>
          </div>

          <div>
            <label><span>{t("settings.subtitles.fontSize")}</span></label>
            <select
              name="subtitle-size"
              id="subtitle-size"
              value={subtitleSettings.fontSize}
              onChange={(e) => handleSubtitleChange('fontSize', e.target.value)}
            >
              <option value="50%">50%</option>
              <option value="75%">75%</option>
              <option value="100%">100%</option>
              <option value="125%">125%</option>
              <option value="150%">150%</option>
            </select>
          </div>

          <div>
            <label><span>{t("settings.subtitles.backgroundColor")}</span></label>
            <select
              name="subtitle-bg"
              id="subtitle-bg"
              value={subtitleSettings.backgroundColor}
              onChange={(e) => handleSubtitleChange('backgroundColor', e.target.value)}
            >
              <option value="transparent">Transparent</option>
              <option value="rgba(0, 0, 0, 0.5)">Semi-transparent Black</option>
              <option value="rgba(128, 128, 128, 0.5)">Semi-transparent Gray</option>
              <option value="black">Black</option>
              <option value="darkgray">Dark Gray</option>
            </select>
          </div>

          <div>
            <label htmlFor="subtitle-color">
              {t("settings.subtitles.fontColor")}
            </label>
            <select
              name="subtitle-color"
              id="subtitle-color"
              value={subtitleSettings.fontColor}
              onChange={(e) => handleSubtitleChange('fontColor', e.target.value)}
            >
              <option value="White">White</option>
              <option value="Yellow">Yellow</option>
              <option value="Blue">Blue</option>
              <option value="Red">Red</option>
              <option value="Green">Green</option>
            </select>
          </div>

          <div>
            <label htmlFor="subtitle-blur">
              {t("settings.subtitles.backgroundBlur")}
            </label>
            <select
              name="subtitle-blur"
              id="subtitle-blur"
              value={subtitleSettings.backgroundBlur}
              onChange={(e) => handleSubtitleChange('backgroundBlur', e.target.value)}
            >
              <option value="0%">0%</option>
              <option value="25%">25%</option>
              <option value="50%">50%</option>
              <option value="75%">75%</option>
              <option value="100%">100%</option>
            </select>
          </div>

          <div>
            <label htmlFor="subtitle-opacity">
              {t("settings.subtitles.opacity")}
            </label>
            <select
              name="subtitle-opacity"
              id="subtitle-opacity"
              value={subtitleSettings.opacity}
              onChange={(e) =>
                handleSubtitleChange('opacity', e.target.value)
              }
            >
              <option value="25%">25%</option>
              <option value="50%">50%</option>
              <option value="75%">75%</option>
              <option value="100%">100%</option>
            </select>
          </div>

          <div>
            <label htmlFor="subtitle-margin">
              {t("settings.subtitles.margin")}
            </label>
            <select
              name="subtitle-margin"
              id="subtitle-margin"
              value={subtitleSettings.margin}
              onChange={(e) =>
                handleSubtitleChange('margin', e.target.value)
              }
            >
              <option value="0%">0%</option>
              <option value="5%">5%</option>
              <option value="10%">10%</option>
              <option value="15%">15%</option>
              <option value="20%">20%</option>
            </select>
          </div>
        </div>

        <h1>{t("settings.appCenter.title")}</h1>
        <div className={styles.group}>
          <Link href="/anime">{t("settings.appCenter.anime")}</Link>
          <Link href="/kdrama">{t("settings.appCenter.kdrama")}</Link>
          <Link href="/domains">{t("settings.appCenter.domains")}</Link>
          <Link href="/downloads">{t("settings.appCenter.downloads")}</Link>
          <Link href="/disclaimer">{t("settings.appCenter.disclaimer")}</Link>
          <Link href="mailto:developer@rivestream.org">{t("settings.appCenter.contactUs")}</Link>
          <Link href="/recommendation">{t("settings.appCenter.recommendation")}</Link>
        </div>

        <h1>{t("settings.links.title")}</h1>
        <div className={styles.group}>
          <Link
            href="https://discord.gg/6xJmJja8fV"
            target="_blank"
          >
            <FaDiscord /> {t("settings.links.discord")}
          </Link>
          <Link
            href="https://unique-maamoul-befc97.netlify.app"
            target="_blank"
          >
            <FaGlobe /> {t("settings.links.website")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
