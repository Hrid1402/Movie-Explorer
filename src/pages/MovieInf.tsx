import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import styles from '../styles/MovieInf.module.css'
import {getMovieDataById, getSeasonData, getSimilarMovies, getMovieImages, getMovieCast, getMovieTrailer} from '../api/moviesData.js'
import { useTranslation } from "react-i18next";
import { IoMdStar } from "react-icons/io";
import YouTubeEmbed from '../components/YouTubeEmbed.js';
import Movie from '../components/Movie.js';
import HashLoader from "react-spinners/HashLoader";
import { CiClock1 } from "react-icons/ci";
import no_photo from '../assets/no-photo.png'
import { IoReturnUpBack } from "react-icons/io5";
import "../config/i18n.js";

function MovieInf() {
    const imageURL500W:String = 'https://image.tmdb.org/t/p/w500/';
    const imageURL2W:String = 'https://image.tmdb.org/t/p/w200/';
    const imageURL3W:String = 'https://image.tmdb.org/t/p/w300/';
    const imageURL4W:String = 'https://image.tmdb.org/t/p/w400/';
    const imageURL1280W:String = 'https://image.tmdb.org/t/p/w1280/'

    const {type, id} = useParams();
    const [loading, setLoading] = useState<boolean>(false);
    const [allMovieData, setAllMovieData] = useState<any>(null);
    const [movieLogo, setMovieLogo] = useState<any>(null);
    const [movieCast, setMovieCast] = useState<any>([]);
    const [trailers, setTrailers] = useState<any>([]);
    const [curTrailer, setCurTrailer] = useState<number>(0);
    const [curSeasonData, setCurSeasonData] = useState<any>(null);
    const [episodesData, setEpisodesData] = useState<any>(null);
    const [similars, setSimilars] = useState<any>([]);
    const { t, i18n } = useTranslation();

    const navigate = useNavigate();

    const [myLibrary, setMyLibrary] = useState<any>(JSON.parse(localStorage.getItem("library") || "[]"));
    const [onLibrary, setOnLibrary] = useState<boolean>(false);

    useEffect(()=>{
        if (myLibrary.length===0){
            localStorage.setItem("library", "[]");
        }else{
            setOnLibrary(myLibrary.some((m:any)=>m.id===id));
        }

    },[id, type])

    useEffect(()=>{
        setMovieData();
        setCurTrailer(0);
    },[id, type, i18n.language])

    useEffect(()=>{
        if(curSeasonData===null)return;
        getEpisodesData()
    }, [curSeasonData])

    function addLibrary(){
        const movieToAdd = {
            id:id, 
            name:allMovieData.original_title ?? allMovieData.original_name,
            poster_path: allMovieData.poster_path,
            media_type: type
        }
        localStorage.setItem("library", JSON.stringify([...myLibrary, movieToAdd]));
        setMyLibrary((prev:any)=>[...prev, movieToAdd]);
        setOnLibrary(true);
    }

    function removeFromLibrary(){
        const cleanLibrary = myLibrary.filter((l:any)=>l.id !== id || l.media_type !== type);
        localStorage.setItem("library", JSON.stringify(cleanLibrary));
        setMyLibrary(cleanLibrary);
        setOnLibrary(false);
    }

    async function getEpisodesData(){
        const data = await getSeasonData(type, id, curSeasonData.season_number,i18n.language);
        console.log('episodes data', data);
        setEpisodesData(data);
    }

    async function setMovieData() {
        setLoading(true);
        getMovieImages(type, id, i18n.language).then((data:any)=>{
            console.log('logo', data ? data.file_path:null);
            setMovieLogo(data ? data.file_path : null)
        });
        getMovieDataById(type, id, i18n.language).then((data:any)=>{
            console.log('movie data',data);
            setAllMovieData(data);
            if(data.seasons){
                setCurSeasonData(data.seasons.find((s:any)=>s.season_number===1));
            }
            setLoading(false);
        });
        getMovieCast(type, id).then((data:any)=>{
            console.log('movie cast',data);
            setMovieCast(data)
        })

        getMovieTrailer(type, id, i18n.language).then((data:any)=>{
            console.log('movie videos',data);
            setTrailers(data);
        })

        getSimilarMovies(type, id, i18n.language).then((data:any)=>{
            console.log('similar data',data.results);
            setSimilars(data.results);
        });
    }

    function convertMinutes(minutes:number) {
        let hours = Math.floor(minutes / 60);
        let mins = minutes % 60;
        return `${hours}h ${mins}m`;
    }

    function compareDate(dateString:string) {
        const givenDate = new Date(dateString);
        const today = new Date();
        
        today.setHours(0, 0, 0, 0);
    
        if (givenDate < today) {
            return "Past";
        } else if (givenDate > today) {
            return "Future";
        } else {
            return "Today";
        }
    }

    function handleSeasonChange(e: React.ChangeEvent<HTMLSelectElement>){
        console.log('value season', e.target.value);
        console.log('cur season data', curSeasonData);
        setCurSeasonData(allMovieData.seasons.find((s:any)=>s.season_number===parseInt(e.target.value)));
    }

    
  return (
    <div className={styles.container} style={{
        background: allMovieData && allMovieData.backdrop_path
          ? `linear-gradient( rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6) ), url('${imageURL1280W + allMovieData.backdrop_path}') no-repeat center center / cover`
          : '#0d0d0d',
      }}>
        <button className={styles['return-btn']} onClick={()=>navigate(-1)}><IoReturnUpBack color='white'/></button>
        {
            loading || allMovieData===null? 
            <div style={{height:'100svh', display:'grid', placeItems:'center'}}>
                <HashLoader color='white' size={''}/>
            </div>
            :
            <>
                <div className={styles['images-container']}>
                    <div className={styles['left-content']}>
                        <img className={styles.poster} src={imageURL500W+allMovieData.poster_path} alt="poster" loading='lazy'/>
                        <div className={styles['small-data']}>
                            <p>{(new Date(allMovieData.release_date ?? allMovieData.first_air_date)).getFullYear()}</p>
                            {allMovieData.runtime && <p>{convertMinutes(allMovieData.runtime)}</p>}
                            {allMovieData.number_of_seasons && <p>{t('seasons')}: {allMovieData.number_of_seasons}</p>}
                            <div className={styles.rating}>
                                <p>{allMovieData.vote_average != 0 ? allMovieData.vote_average.toFixed(1) : '0.0'}</p>
                                <IoMdStar/>
                            </div>
                        </div>
                    </div>
                    <div className={styles['right-content']}>
                        {movieLogo ? <img className={styles.logo} src={imageURL4W+movieLogo} loading='lazy'/> : <h1 className={styles['second-title']}>{allMovieData.title}</h1>}
                        <div className={styles['original-title']}>
                            <span>{t('ogTitle')}: </span>
                            <span>{allMovieData.original_title ?? allMovieData.original_name}</span>
                        </div>
                        
                        <div className={styles['small-data-right']}>
                            <p>{(new Date(allMovieData.release_date ?? allMovieData.first_air_date)).getFullYear()}</p>
                            {allMovieData.runtime && <p>{convertMinutes(allMovieData.runtime)}</p>}
                            {allMovieData.number_of_seasons && <p>{t('seasons')}: {allMovieData.number_of_seasons}</p>}
                            <div className={styles.rating}>
                                <p>{allMovieData.vote_average != 0 ? allMovieData.vote_average.toFixed(1) : '0.0'}</p>
                                <IoMdStar/>
                            </div>
                        </div>
                        <div className={styles['genres-container']}>
                            {allMovieData.genres.map((g:any)=>{
                                return <Link key={g.id} className={styles.genre} to={`/explore/${type}`}>{g.name}</Link>
                            })}
                        </div>
                        <p className={styles.overview}>{allMovieData.overview}</p>
                        {onLibrary ? 
                        <button onClick={()=>removeFromLibrary()} className={styles['add-btn']}>{t('remove')}</button>:
                        <button onClick={()=>addLibrary()} className={styles['add-btn']}>{t('add')}</button>}
                    </div>
                </div>
                
                {
                    allMovieData.seasons && allMovieData.seasons.length>0 && 
                    <div className={styles['seasons-content']}>
                        <h2 className={styles['seasons-title']}>{t('seasons')}</h2>
                        
                        <div className={styles['seasons-data']}>
                            <div className={styles['season-data-left']}>
                                <select className={styles['select-season']} onChange={e=>handleSeasonChange(e)}>
                                {
                                allMovieData.seasons.sort((a: any, b: any) => (a.season_number === 0 ? 1 : b.season_number === 0 ? -1 : 0))
                                    .map((s: any) => (
                                        <option className={styles.option} value={s.season_number} key={s.id}>{s.name}</option>
                                    ))}
                                </select>
                                {curSeasonData && <img className={styles['season-poster']} src={imageURL3W+(curSeasonData.poster_path ? curSeasonData.poster_path : allMovieData.poster_path)} loading='lazy'/>}
                                {episodesData && 
                                    <div className={styles['season-overview']}>
                                        <p>
                                            {episodesData.overview}
                                        </p>
                                    </div>
                                }
                            </div>
                            <div className={styles['season-data-right']}>
                                {
                                    episodesData &&
                                    <>
                                    <select className={styles['select-season-top']} onChange={e=>handleSeasonChange(e)}>
                                    {
                                        allMovieData.seasons.sort((a: any, b: any) => (a.season_number === 0 ? 1 : b.season_number === 0 ? -1 : 0))
                                        .map((s: any) => (
                                            <option className={styles.option} value={s.season_number} key={s.id}>{s.name}</option>
                                    ))}
                                    </select>
                                        <h3 className={styles['episodes-amount']}>{t('episodes')}: {episodesData.episodes.length}</h3>
                                        <div className={styles['episodes-container']}>
                                            {
                                                    episodesData.episodes.map((episode:any)=>{
                                                    const date = compareDate(episode.air_date);
                                                    return(
                                                        <div className={styles.episode} key={episode.id}>
                                                            <div className={styles.episodeImage}>
                                                                <img className={`${date !== 'Past' ? styles.futureEpisodeIMG : ''}`} src={imageURL2W+episode.still_path} onError={e=>e.currentTarget.src=imageURL3W+allMovieData.poster_path} loading='lazy'/>
                                                                <div className={styles['episode-number']}>
                                                                    <p >{episode.episode_number}</p>
                                                                </div>
                                                                { date !== 'Past' &&
                                                                    <div className={styles.futureEpisodeContainer}>
                                                                        <CiClock1 size={'40%'}/>
                                                                        <p>{date === 'Today' ? 'Today' : (new Date(episode.air_date)).toLocaleDateString("en-GB").slice(0, 8)}</p>
                                                                    </div>
                                                                }
                                                                
                                                            </div>
                                                        <div className={styles['episode-inf']}>
                                                                <p className={styles['episode-inf-name']}>{episode.name}</p>
                                                                <div className={styles['episode-inf-overview-container']}>
                                                                    <p className={styles['episode-inf-overview']}>{episode.overview}</p>
                                                                </div>
                                                        </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                        
                    </div>
                }
                {
                    movieCast.length>0 &&
                    <div className={styles['cast-content']}>
                        <h2 className={styles['cast-text']}>{t('cast')}</h2>
                        <div className={styles['cast-container']}>
                        {
                            movieCast.map((c:any)=>{
                                return (
                                    <Link to={'/person/'+c.id} key={c.id} className={styles['cast-element']}>
                                        <img src={c.profile_path ? imageURL2W+c.profile_path : no_photo} loading='lazy'/>
                                        <div className={styles['cast-element-data']}>
                                            <p className={styles['cast-name']}>{c.name}</p>
                                            <p className={styles['cast-character']}>{c.character}</p>
                                        </div>
                                    </Link>
                                )
                            })
                        }
                        </div>
                    </div>
                }
                
                {
                    trailers.length>0 && 
                    <div className={styles['videos-container']}>
                        <h2 className={styles['videos-title']}>Videos</h2>
                        <div className={styles['videos-all-videos']}>
                            {
                                trailers.map((t:any, i:number)=>{
                                    const selected = i === curTrailer;
                                    return (
                                        <button disabled={selected} className={styles['video-btn']} key={i} onClick={()=>setCurTrailer(i)}>{t.type}</button>
                                    )
                                })
                            }
                        </div>
                        <div className={styles['trailer-container']}>
                            <YouTubeEmbed videoId={trailers[curTrailer].key}/>
                        </div>
                    </div>
                }
                {
                    similars.length>0 &&
                    <div className={styles['similar-section']}>
                        <h2 className={styles['similar-title']}>{t('similar')}</h2>
                        <div className={styles['similar-container']}>
                            {
                                similars.map((s:any, i:number)=>{
                                    if(!s.poster_path)return
                                    return(
                                        <Movie type={type} key={i} movie={s} path={undefined}/>
                                    )
                                })
                            }
                        </div>
                    </div>
                }
            </>
        }
    </div>
    
  )
}

export default MovieInf