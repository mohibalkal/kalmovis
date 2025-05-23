import React, { useState, useEffect } from "react";
import styles from "@/styles/Settings.module.scss";
import Link from "next/link";
import { loginUserGoogle, loginUserManual } from "@/Utils/firebaseUser";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/Utils/i18n";

const LoginPage = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const { push } = useRouter();
  const { t } = useTranslation();

  const handleFormSubmission = async (e: any) => {
    e.preventDefault();
    if (await loginUserManual({ email, password })) {
      push("/settings");
    }
  };

  const handleGoogleSignIn = async (e: any) => {
    e.preventDefault();
    if (await loginUserGoogle()) {
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
        <h1>{t("auth.login")}</h1>
        <div className={styles.group2}>
          <>
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
        <h4 className={styles.signin} onClick={handleGoogleSignIn}>
          {t("auth.continueWith")} <span className={styles.highlight}>{t("auth.google")}</span>
        </h4>
        <h4>
          {t("auth.dontHaveAccount")}
          <Link href="/signup" className={styles.highlight}>
            &nbsp;{t("auth.signup")}
          </Link>
        </h4>
        {/* <h4 onClick={() => resetPassword(email)} className={styles.highlight}>Forgot Password?</h4> */}
      </div>
    </div>
  );
};

export default LoginPage;
