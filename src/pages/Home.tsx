import React, { useEffect, useRef, useState } from 'react'
import {getTrendingMovies} from '../api/moviesData.js'
import { useTranslation } from "react-i18next";
import Movie from '../components/Movie.js';
import styles from '../styles/Home.module.css'
import InfiniteScroll from 'react-infinite-scroll-component';
import { Outlet, useLocation } from 'react-router-dom';

interface MovieInterface {
  backdrop_path: string;
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string;
  media_type: string;
  adult: boolean;
  original_language: string;
  genre_ids: number[];
  popularity: number;
  release_date: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

function Home() {
  const [movies, setMovies] = useState<MovieInterface[]>([]);
  let page = useRef<number>(1);
  let hasItems = useRef<boolean>(true);
  const location = useLocation();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (location.pathname !== "/") {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [location.pathname]);
  
  useEffect(()=>{
    window.scrollTo(0, 0);
    setMovies([]);
    page.current = 1;
    setMoviesData();
  },[i18n.language])


  async function setMoviesData(){
    console.log('GETTING DATA...');
    const trending = await getTrendingMovies(page.current, 'week', i18n.language);
    console.log(trending);
    if(trending.results.length>1){
      page.current +=1;
      setMovies(prev=>[...prev, ...trending.results]);
    }else{
      hasItems.current = false;
    }
    
  }

  return (
    <div className={styles.home}>
      <div>Current main movies</div>
      <InfiniteScroll
          dataLength={movies.length}
          next={setMoviesData}
          hasMore={hasItems.current}
          loader={'Loading'}>
          <div className={styles['movies-container']}>
          {
            movies.map((movie, i)=>{
              if(movie.media_type === 'person')return
              return <Movie key={i} movie={movie}/>
            })
          }
        </div>
      </InfiniteScroll>
      <Outlet/>
    </div>
  )
}

export default Home