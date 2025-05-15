import React, { useState, useEffect } from "react";
import styles from "@/styles/Settings.module.scss";
import Link from "next/link";
import { signupUserManual } from "@/Utils/firebaseUser";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/Utils/i18n";

const SignupPage = () => {
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const { push } = useRouter();
  const { t } = useTranslation();

  const handleFormSubmission = async (e: any) => {
    e.preventDefault();
    if (await signupUserManual({ username, email, password })) {
      push("/settings");
    }
  };
  return (
    <div className={`${styles.settingsPage} ${styles.authPage}`}>
      <div className={styles.logo}>
        <img
          src="/images/logo.svg"
          alt="logo"
          data-tooltip-id="tooltip"
          data-tooltip-content="Rive"
        />
        <p>Your Personal Streaming Oasis</p>
      </div>
      <div className={styles.settings}>
        <h1>{t("auth.signup")}</h1>
        <div className={styles.group2}>
          <>
            <label htmlFor="username">{t("auth.username")}</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e: any) => setUsername(e.target.value)}
              required
            />
            <label htmlFor="email">{t("auth.email")}</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="password">{t("auth.password")}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              required
            />
            <button onClick={handleFormSubmission}>{t("common.confirm")}</button>
          </>
        </div>
        <h4>
          {t("auth.alreadyHaveAccount")}{" "}
          <Link href="/login" className={styles.highlight}>
            {t("auth.login")}
          </Link>
        </h4>
      </div>
    </div>
  );
};

export default SignupPage;
