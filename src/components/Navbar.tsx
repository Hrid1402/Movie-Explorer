import React from 'react'
import { useTranslation } from "react-i18next";
import styles from '../styles/Navbar.module.css'
import { Link, useLocation } from 'react-router-dom';
import { IoSearchOutline } from "react-icons/io5";
import { IoHomeOutline } from "react-icons/io5";
import { LuSquareLibrary } from "react-icons/lu";
import { LuClapperboard } from "react-icons/lu";
import { FaTv } from "react-icons/fa";
import "../config/i18n.js";

function Navbar() {
    const { t, i18n } = useTranslation();
    const location = useLocation();

    function handleLanguageChange(e: React.ChangeEvent<HTMLSelectElement>){
      i18n.changeLanguage(e.target.value)
    }
  return (
    <>
      <header className={styles.container}>
        <div className={styles['buttons-path']}>
          <Link to={'/'}  className={`${styles['hidden-btn']} ${location.pathname === '/' ? styles.selected : ''}`}><IoHomeOutline />{t("home")}</Link>
          <Link to={'/explore/movie'} className={location.pathname === "/explore/movie" ? styles.selected : ''}><LuClapperboard />{t("movies")}</Link>
          <Link to={'/explore/tv'} className={location.pathname === "/explore/tv" ? styles.selected : ''}><FaTv />{t("shows")}</Link>
        </div>

        <div className={styles['right-side']}>
          <select onChange={e=>handleLanguageChange(e)} value={i18n.language}>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="de">German</option>
            <option value="fr">French</option>
            <option value="it">Italian</option>
          </select>
          <Link className={styles['search-btn']} to={'/library'}><LuSquareLibrary color='white'/></Link>
          <Link className={styles['search-btn']} to={'/search'}><IoSearchOutline color='white'/></Link>
        </div>

    </header>

    <footer className={styles['bottom-navBar']}>
      <Link to={'/'}><IoHomeOutline color='white'/></Link>
      <Link className={styles['bottom-search-btn']} to={'/search'}><IoSearchOutline color='white'/></Link>
      <Link  to={'/library'}><LuSquareLibrary color='white'/></Link>
    </footer>
    </>
  )
}

export default Navbar