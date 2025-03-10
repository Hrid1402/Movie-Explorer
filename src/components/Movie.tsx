import { useState } from 'react'
import { Link } from 'react-router-dom';
import styles from '../styles/Movie.module.css'
import { IoMdStar } from "react-icons/io";

const imageURL:String = 'https://image.tmdb.org/t/p/w300/';

interface Movie {
    backdrop_path: string;
    id: number;
    title: string;
    name: string;
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
interface MovieProps {
    movie: Movie;
    type: String | undefined;
    path: String | undefined;
}

function capitalizeFirstLetter(text:String) {
    return String(text).charAt(0).toUpperCase() + String(text).slice(1);
}


function Movie({movie, type, path='/'}: MovieProps) {
    const [error, setError] = useState(false);
  return (
    <Link className={`${styles.container} ${error ? styles['no-image'] : ''}`} to={`${path}${type ?? movie.media_type}/${movie.id}`}>
        <img style={{display:`${error ? 'none' : 'block'}`}} className={styles.poster} src={imageURL + movie.poster_path} loading='lazy'
        onError={() => setError(true)}
        />
        <div className={styles['movie-data']}>
            <div className={styles['movie-main-data']}>
                <p className={styles.title}>{movie.title ?? movie.name}</p>
                <p className={styles.type}>{capitalizeFirstLetter(type ?? movie.media_type)}</p>
            </div>
            <div className={styles.rating}>
                <p className={styles['rating-text']}>{movie.vote_average !== undefined && movie.vote_average != 0 ? movie.vote_average.toFixed(1) : '0.0'}</p>
                <IoMdStar/>
            </div>
        </div>
    </Link>
  )
}

export default Movie