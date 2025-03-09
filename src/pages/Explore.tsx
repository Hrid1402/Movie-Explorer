import React, { useEffect, useRef, useState } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import styles from '../styles/Explore.module.css'
import { useTranslation } from "react-i18next";
import InfiniteScroll from 'react-infinite-scroll-component';
import PropagateLoader from "react-spinners/PropagateLoader";
import "../config/i18n.js";
import Movie from '../components/Movie.tsx'
import { v4 as uuidv4 } from 'uuid';
import {opt_getTrending, opt_getLatest, opt_getBestRated, opt_getPopular, opt_getUpcoming, opt_getNowPlaying, opt_getByGenre} from '../api/moviesData.ts'

function Explore() {
    const options = [
        "opt_trending",
        "opt_latest",
        "opt_bestRated",
        "opt_popular",
        "opt_upcoming",
        "opt_nowPlaying",
        "opt_action",
        "opt_adventure",
        "opt_animation",
        "opt_comedy",
        "opt_crime",
        "opt_documentary",
        "opt_drama",
        "opt_family",
        "opt_fantasy",
        "opt_history",
        "opt_horror",
        "opt_music",
        "opt_mystery",
        "opt_romance",
        "opt_sciFi",
        "opt_thriller",
        "opt_war",
        "opt_western",
      ];      

    const [curOption, setCurOption] = useState<string>("opt_trending");
    const { t, i18n } = useTranslation();
    const {type} = useParams();
    let page = useRef<number>(1);
    let prevFetch = useRef<string>('opt_trending');
    const [movies, setMovies] = useState<any>([]);



    const isGenreOption = (option: string) => {
        console.log('checking', option);
        return option.startsWith('opt_') && !['opt_trending', 'opt_latest', 'opt_bestRated', 'opt_popular', 'opt_upcoming', 'opt_nowPlaying'].includes(option);
    };


    const fetchOptions: Record<string, any> = {
        opt_trending: opt_getTrending,
        opt_latest: opt_getLatest,
        opt_bestRated: opt_getBestRated,
        opt_popular: opt_getPopular,
        opt_upcoming: opt_getUpcoming,
        opt_nowPlaying: opt_getNowPlaying,
        opt_action:  opt_getByGenre,
        opt_adventure:  opt_getByGenre,
        opt_animation:  opt_getByGenre,
        opt_comedy:  opt_getByGenre,
        opt_crime:  opt_getByGenre,
        opt_documentary:  opt_getByGenre,
        opt_drama:  opt_getByGenre,
        opt_family:  opt_getByGenre,
        opt_fantasy:  opt_getByGenre,
        opt_history:  opt_getByGenre,
        opt_horror:  opt_getByGenre,
        opt_music: opt_getByGenre,
        opt_mystery: opt_getByGenre,
        opt_romance: opt_getByGenre,
        opt_sciFi: opt_getByGenre,
        opt_thriller: opt_getByGenre,
        opt_war: opt_getByGenre,
        opt_western: opt_getByGenre
    }

    const genreIds: Record<string, number> = {
        opt_action: 28,
        opt_adventure: 12,
        opt_animation: 16,
        opt_comedy: 35,
        opt_crime: 80,
        opt_documentary: 99,
        opt_drama: 18,
        opt_family: 10751,
        opt_fantasy: 14,
        opt_history: 36,
        opt_horror: 27,
        opt_music: 10402,
        opt_mystery: 9648,
        opt_romance: 10749,
        opt_sciFi: 878,
        opt_thriller: 53,
        opt_war: 10752,
        opt_western: 37
    };
    

    async function handleOption() {
        if (fetchOptions[curOption]) {
            if (prevFetch.current === curOption) {
                page.current += 1;
                let data:any = [];
                if(isGenreOption(curOption)){
                    data = await opt_getByGenre(page.current, type, String(genreIds[curOption]), i18n.language);
                }else{
                    data = await fetchOptions[curOption](page.current, type, i18n.language, 'week');
                }
                setMovies((prev: any) => [...prev, ...data]);
                
            } else {
                window.scrollTo(0, 0);
                let data:any = [];
                if(isGenreOption(curOption)){
                    data = await opt_getByGenre(1, type, String(genreIds[curOption]), i18n.language);
                }else{
                    data = await fetchOptions[curOption](1, type, i18n.language, 'week');
                }
                setMovies(data);
                page.current = 1;
                prevFetch.current = curOption;
            }
        }
    }

      useEffect(()=>{
        setCurOption("opt_trending");
        page.current = 0;
        prevFetch.current = "opt_trending";
        setMovies([]);
        if(curOption==='opt_trending'){
            handleOption();
        }
    },[type, i18n.language])

      useEffect(()=>{
        handleOption();
      },[curOption])

      
  return (
    <div className={styles['explore-container']}>
        <div className={styles['navBar-container']}>
          <nav className={styles['explore-nav-bar']}>
              {options.map((o, i)=>{
                  if(type==='tv' && ['opt_horror', 'opt_upcoming', 'opt_nowPlaying', 'opt_latest', 'opt_action', 'opt_adventure', 'opt_fantasy', 'opt_music', 'opt_war', 'opt_thriller', 'opt_sciFi'].includes(o)) return
                  return(
                      <button key={i} onClick={()=>setCurOption(o)} className={`${styles.option} ${curOption===o  ? styles.selected : ''}`} disabled={curOption===o}>{t(o)}</button>
                  )
              })}
          </nav>
        </div>
        <div>
        <InfiniteScroll
          dataLength={movies.length}
          next={handleOption}
          hasMore={true}
          loader={<div style={{width:'100%', display:'grid', placeContent:'center', marginBottom:'30px'}}><PropagateLoader color='white'/></div>}>
          <div className={styles['movies-container']}>
          {
            movies.map((movie:any)=>{
              if(movie.media_type === 'person')return
              return <Movie path={`/explore/${type}/`} type={type} key={uuidv4()} movie={movie}/>
            })
          }
        </div>
      </InfiniteScroll>
        </div>
        <Outlet/>
    </div>
    
  )
}

export default Explore