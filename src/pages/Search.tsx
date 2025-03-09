import React, { useEffect, useState } from 'react'
import {getTrendingMovies, searchByName} from '../api/moviesData.ts'
import ClipLoader from "react-spinners/ClipLoader";
import Movie from '../components/Movie.js';
import { useTranslation } from "react-i18next";
import { IoSearchOutline } from "react-icons/io5";
import { Outlet } from 'react-router-dom';
import styles from  '../styles/Search.module.css'

function Search() {
    const { t, i18n } = useTranslation();
    const [query, setQuery] = useState<string>('');
    const [movies, setMovies] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(()=>{
        const setDefaultData = async()=>{
            setLoading(true);
            const trending = await getTrendingMovies(1, 'week', i18n.language);
            console.log('trending', trending);
            setMovies(trending.results);
            setLoading(false);
        };
        setDefaultData();
    },[i18n.language])

    useEffect(()=>{
        if (query.length < 2) {
            setMovies([]);
            return;
        }

        const delayDebounce = setTimeout(async() => {
            setLoading(true);
            const data = await searchByName(query, i18n.language);
            console.log(data);
            setMovies(data.results);
            setLoading(false);
          }, 500);
          return () => clearTimeout(delayDebounce);
    },[query, i18n.language])

  return (
    <div className={styles['search-container']}>
        <div className={styles['input-container']}>
            <IoSearchOutline color='white' className={styles.icon} />
            <input type="text" placeholder={t('type_here')} value={query} onChange={e=>setQuery(e.target.value)}/>
        </div>
        
        <div>
            <h2 className={styles['searching-text']}>{query ? `Search: ${query}` : t('trending')}</h2>
            {
                loading ? 
                <div style={{width:'100%', marginTop:'70px', display:'grid', placeContent:'center'}}>
                    <ClipLoader color='white' size={'220px'}/>
                </div> :
                <div className={styles['movies-results-container']}>
                {
                    movies.map((movie:any, i:number)=>{
                        if(movie.media_type === 'person')return
                        return(
                            <Movie key={i} movie={movie} path={'/search/'} type={undefined}/>
                        )
                    })
                }
                </div>
            }
        </div>
        <Outlet/>
    </div>
  )
}

export default Search