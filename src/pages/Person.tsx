import  { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {getPersonMovies, getPersonData} from '../api/moviesData.ts'
import { useTranslation } from 'react-i18next';
import Movie from '../components/Movie.tsx';
import styles from '../styles/Person.module.css'
import { v4 as uuidv4 } from 'uuid';

function Person() {
    const imageURL4W:String = 'https://image.tmdb.org/t/p/w400/';
    const {id} = useParams();
    const [movies, setMovies] = useState<any>([]);
    const [crew, setCrew] = useState<any>([]);
    const [actorData, setActorData] = useState<any>([]);
    const { t, i18n } = useTranslation();

    useEffect(()=>{
        if(!id) return
        setData();
    },[id, i18n.language])

async function setData(){
    getPersonMovies(id, i18n.language).then(data=>{
        console.log(data)
        const uniqueMovies:any = [];
        const movieIds = new Set();
        data.cast.forEach((movie: any) => {
            if (!movieIds.has(movie.id)) {
              movieIds.add(movie.id);
              uniqueMovies.push(movie);
            }
            setMovies(uniqueMovies);
         });
        
        const uniqueCrew:any = [];
        const crewIds = new Set();

        data.crew.forEach((movie: any) => {
        if (!crewIds.has(movie.id)) {
            crewIds.add(movie.id);
            uniqueCrew.push(movie);
        }
        setCrew(uniqueCrew);
        });
    })
    getPersonData(id, i18n.language).then(data=>{
        console.log('data', data);
        setActorData(data);
    })
    
}
  return (
    <div className={styles['person-container']}>
        
        {
            actorData &&
            <div className={styles['actor-data-container']}>
                <img src={imageURL4W+actorData.profile_path}/>
                <div className={styles['left-side-actor']}>
                    <h1>{actorData.name}</h1>
                    <p>{actorData.biography}</p>
                </div>
            </div>
        }
        <div className={styles['other-data']}>
            <h2 className={styles.title}>{t('personal_inf')}</h2>
            <p><b>{t('primary_prof')}:</b> {actorData.known_for_department}</p>
            <p><b>{t('place_birth')}:</b> {actorData.place_of_birth}</p>
            <p><b>{t('birthday')}:</b> {actorData.birthday}</p>
            {actorData.deathday && <p><b>{t('deathday')}:</b> {actorData.deathday}</p>}
        </div>
        <h2 className={styles.title}>{t('notable_roles')}</h2>
        <div className={styles['movies-container']}>
            {movies.map((m:any)=>{
                return (
                    <Movie type={undefined} movie={m} key={uuidv4()} path={undefined}/>
                )
            })
            }
        </div>
        <h2 className={styles.title}>{t('other_contributions')}</h2>
        <div className={styles['movies-container']}>
            {crew.map((m:any)=>{
                return (
                    <Movie type={undefined} movie={m} key={uuidv4()} path={undefined}/>
                )
            })
            }
        </div>
    </div>
  )
}

export default Person