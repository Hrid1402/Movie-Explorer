import React from 'react'
import { useTranslation } from "react-i18next";
import styles from '../styles/Navbar.module.css'
import { Link } from 'react-router-dom';
import "../config/i18n.js";

function Navbar() {
    const { t, i18n } = useTranslation();

    function handleLanguageChange(e: React.ChangeEvent<HTMLSelectElement>){
      i18n.changeLanguage(e.target.value)
    }
  return (
    <header className={styles.container}>
        <div className={styles['buttons-path']}>
          <Link to={'/'}>{t("home")}</Link>
          <Link to={'/'}>{t("movies")}</Link>
          <Link to={'/'}>{t("shows")}</Link>
        </div>

        <select onChange={e=>handleLanguageChange(e)} value={i18n.language}>
          <option value="en">English</option>
          <option value="es">Spanish</option>
        </select>

    </header>
  )
}

export default Navbar