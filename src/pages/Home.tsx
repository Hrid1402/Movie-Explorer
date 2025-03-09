import React, { useEffect, useRef, useState } from 'react'
import {getTrendingMovies, getMovieImages} from '../api/moviesData.ts'
import { useTranslation } from "react-i18next";
import Movie from '../components/Movie.js';
import styles from '../styles/Home.module.css'
import InfiniteScroll from 'react-infinite-scroll-component';
import PropagateLoader from "react-spinners/PropagateLoader";
import { Outlet, useLocation, Link } from 'react-router-dom';

interface MovieInterface {
  name: string;
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
  const imageURL:String = 'https://image.tmdb.org/t/p/original/';
  const imageURL400:String = 'https://image.tmdb.org/t/p/w400/';

  const [movies, setMovies] = useState<MovieInterface[]>([]);
  let page = useRef<number>(1);
  let hasItems = useRef<boolean>(true);
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const [mainMovie, setMainMovie] = useState<any>(null);
  
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
    if(!mainMovie || mainMovie.logo) return
    const addLogoMainMovie = async()=>{
      const logo = await getMovieImages(mainMovie.media_type, mainMovie.id, i18n.language);
      console.log('main logo', imageURL400+logo.file_path);
      setMainMovie((prev:any)=>({...prev, logo: imageURL400 + logo.file_path}));
    }
    addLogoMainMovie();
  }, [mainMovie])
  
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
      setMainMovie(trending.results[Math.floor(Math.random() * trending.results.length)]);
      setMovies(prev=>[...prev, ...trending.results]);
    }else{
      hasItems.current = false;
    }
  }

  return (
    <div className={styles.home}>
      {
        mainMovie && 
        <div className={styles['main-movies']} >
          <div className={styles['main-movies-left']}>
            {mainMovie.logo && <img className={styles['main-movies-logo']} src={mainMovie.logo}/>}
            <div className={styles['main-movies-data-text']}>
              <p><b>{mainMovie.original_title ?? mainMovie.original_name}: </b> {mainMovie.overview}</p>
            </div>
            <Link className={styles['more-inf']} to={`/${mainMovie.media_type}/${mainMovie.id}`}>{t('more_inf')}</Link>
          </div>
          <img className={styles['main-movie-backdrop']} src={imageURL + mainMovie.backdrop_path}/>
        </div>
      }
      <h3 className={styles['trending-text']}>{t('trending_text')}</h3>
      <InfiniteScroll
          dataLength={movies.length}
          next={setMoviesData}
          hasMore={hasItems.current}
          loader={<div style={{width:'100%', display:'grid', placeContent:'center', marginBottom:'30px'}}><PropagateLoader color='white'/></div>}>
          <div className={styles['movies-container']}>
          {
            movies.map((movie, i)=>{
              if(movie.media_type === 'person')return
              return <Movie key={i} type={undefined} path={undefined} movie={movie}/>
            })
          }
        </div>
      </InfiniteScroll>
      <Outlet/>
    </div>
  )
}

export default Home