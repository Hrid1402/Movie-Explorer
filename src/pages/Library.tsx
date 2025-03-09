import React, { useState } from 'react'
import Movie from '../components/Movie.js';
import styles from '../styles/Library.module.css'

function Library() {
    const [myLibrary] = useState<any>(JSON.parse(localStorage.getItem("library") || "[]"));
    const [curFilter, setCurFilter] = useState<string>('all');

    function handleFilterChange(e: React.ChangeEvent<HTMLSelectElement>){
        setCurFilter(e.target.value);
    }


    return (
    <div className={styles.library}>
        <h2 className={styles.title}>My library</h2>
        <p className={styles.total}>Total: {myLibrary.length}</p>
        <select onChange={e=>handleFilterChange(e)}>
            <option value="all">All</option>
            <option value="movie">Movies</option>
            <option value="tv">Shows</option>
        </select>
        
        <div className={styles['movies-container']}>
            {
                myLibrary.map((movie:any)=>{
                    if(movie.media_type === curFilter || curFilter==='all'){
                        return <Movie key={movie.id} movie={movie} type={undefined} path={undefined}/>
                    }
                  })
            }
        </div>
    </div>
  )
}

export default Library