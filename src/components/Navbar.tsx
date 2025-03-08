import React from 'react'
import { useTranslation } from "react-i18next";
import styles from '../styles/Navbar.module.css'
import { Link } from 'react-router-dom';
import { IoSearchOutline } from "react-icons/io5";
import { IoHomeOutline } from "react-icons/io5";
import { LuSquareLibrary } from "react-icons/lu";
import { LuClapperboard } from "react-icons/lu";
import { FaTv } from "react-icons/fa";
import "../config/i18n.js";

function Navbar() {
    const { t, i18n } = useTranslation();

    function handleLanguageChange(e: React.ChangeEvent<HTMLSelectElement>){
      i18n.changeLanguage(e.target.value)
    }
  return (
    <>
      <header className={styles.container}>
        <div className={styles['buttons-path']}>
          <Link to={'/'} className={styles['hidden-btn']}><IoHomeOutline />{t("home")}</Link>
          <Link to={'/'}><LuClapperboard />{t("movies")}</Link>
          <Link to={'/'}><FaTv />{t("shows")}</Link>
        </div>

        <div className={styles['right-side']}>
          <select onChange={e=>handleLanguageChange(e)} value={i18n.language}>
            <option value="en">English</option>
            <option value="es">Spanish</option>
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