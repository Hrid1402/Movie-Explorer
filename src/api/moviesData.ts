import axios from "axios";

const BASE_URL = 'https://api.themoviedb.org/3';
const HEADERS = {
    Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
};

export async function getTrendingMovies(page:number, time:string, language:string){
    try {
        const data = await axios.get(`${BASE_URL}/trending/all/${time}?language=${language}&page=${page}`,{headers: HEADERS})
        return data.data;
    } catch (error: any) {
        console.log('Error trying to fetch trending movies', error.error);
    }
}

export async function getMovieDataById(type:string | undefined, id:string | undefined, language:string) {
    try {
        const data = await axios.get(`${BASE_URL}/${type}/${id}?language=${language}`,{headers: HEADERS});
        return data.data;
    } catch (error: any) {
        console.log('Error trying to fetch movie by id', error.error);
    }
}

export async function getSimilarMovies(type:string | undefined | undefined, id:string | undefined, language:string){
    try {
        const data = await axios.get(`${BASE_URL}/${type}/${id}/similar?language=${language}`,{headers: HEADERS});
        return data.data;
    } catch (error: any) {
        console.log('Error trying to fetch movie by id', error.error);
    }
}

export async function searchByName(name:string, language:string){
    try {
        const data = await axios.get(`${BASE_URL}/search/multi?query=${name}&language=${language}`,{headers: HEADERS});
        return data.data;
    } catch (error: any) {
        console.log('Error trying to search movie by name', error.error);
    }
}

export async function getSeasonData(type:string | undefined, id:string | undefined, season_number:number, language:string) {
    try {
        const data = await axios.get(`${BASE_URL}/${type}/${id}/season/${season_number}?language=${language}`,{headers: HEADERS});
        return data.data;
    } catch (error: any) {
        console.log('Error trying to fetch season data', error.error);
    }
}


export async function getMovieImages(type:string | undefined, id:string | undefined, language:string) {
    try {
        const data = await axios.get(`${BASE_URL}/${type}/${id}/images?language=${language}`,{headers: HEADERS});
        const images = data.data;
        if(images.logos && images.logos[0]){
            return images.logos[0];
        }else{
            const original = await axios.get(`${BASE_URL}/${type}/${id}/images`,{headers: HEADERS});
            return original.data.logos[0]
        }
    } catch (error: any) {
        console.log('Error trying to fetch movie images', error.error);
    }
}
export async function getMovieCast(type:string | undefined, id:string | undefined){
    try {
        const data = await axios.get(`https://api.themoviedb.org/3/${type}/${id}/credits`,{headers: HEADERS});
        return data.data.cast.slice(0, 10);
    } catch (error: any) {
        console.log('Error trying to fetch movie cast', error.error);
    }
}

export async function getMovieTrailer(type:string | undefined, id:string | undefined, language:string) {
    try {
        const data = await axios.get(`${BASE_URL}/${type}/${id}/videos?language=${language}`,{headers: HEADERS});
        const trailers = data.data.results;
        let finalTrailers = [];
        finalTrailers = trailers.filter((t:any) => t.official === true && (t.type === "Trailer" || t.type === "Teaser " || t.type === "Clip" || t.type === "Opening Credits"));

        if(finalTrailers.length > 0){
            finalTrailers.sort((a:any, _b:any) => (a.type === "Trailer" ? -1 : 1));
            return finalTrailers
        }else{
            const ogData = await axios.get(`${BASE_URL}/${type}/${id}/videos`,{headers: HEADERS});
            const oGTrailers = ogData.data.results;
            finalTrailers = oGTrailers.filter((t:any) => t.official === true && (t.type === "Trailer" || t.type === "Teaser " || t.type === "Clip" || t.type === "Opening Credits"));
            finalTrailers.sort((a:any, _b:any) => (a.type === "Trailer" ? -1 : 1));
            return finalTrailers
        }
        
    } catch (error: any) {
        console.log('Error trying to fetch movie trailer', error.error);
    }
}
//opt


export async function opt_getTrending(page:number, type:string | undefined, language:string, time:string){
    try {
        const data = await axios.get(`${BASE_URL}/trending/${type}/${time}?language=${language}&page=${page}`,{headers: HEADERS});
        return data.data.results;
    } catch (error: any) {
        console.log('Error trying to fetch trending opt', error.error);
    }
}

export async function opt_getLatest(page:number, type:string | undefined, language:string){
    try {
        const data = await axios.get(`${BASE_URL}/discover/${type}?language=${language}&page=${page}&sort_by=primary_release_date.desc`,{headers: HEADERS});
        return data.data.results;
    } catch (error: any) {
        console.log('Error trying to fetch latest opt', error.error);
    }
}

export async function opt_getBestRated(page:number, type:string | undefined, language:string) {
    try {
        const data = await axios.get(`${BASE_URL}/${type}/top_rated?language=${language}&page=${page}`, { headers: HEADERS });
        return data.data.results;
    } catch (error: any) {
        console.log('Error trying to fetch best-rated opt', error);
    }
}

export async function opt_getPopular(page:number, type:string | undefined, language:string) {
    try {
        const data = await axios.get(`${BASE_URL}/${type}/popular?language=${language}&page=${page}`, { headers: HEADERS });
        return data.data.results;
    } catch (error: any) {
        console.log('Error trying to fetch popular opt', error);
    }
}

export async function opt_getUpcoming(page:number, type:string | undefined, language:string) {
    try {
        const data = await axios.get(`${BASE_URL}/${type}/upcoming?language=${language}&page=${page}`, { headers: HEADERS });
        return data.data.results;
    } catch (error: any) {
        console.log('Error trying to fetch upcoming opt', error);
    }
}

export async function opt_getNowPlaying(page:number, type:string | undefined, language:string) {
    try {
        const data = await axios.get(`${BASE_URL}/${type}/now_playing?language=${language}&page=${page}`, { headers: HEADERS });
        return data.data.results;
    } catch (error: any) {
        console.log('Error trying to fetch now playing opt', error);
    }
}

export async function opt_getByGenre(page:number, type:string | undefined, genreId:string | undefined, language:string) {
    try {
        const data = await axios.get(`${BASE_URL}/discover/${type}?language=${language}&page=${page}&with_genres=${genreId}`, { headers: HEADERS });
        return data.data.results;
    } catch (error: any) {
        console.log(`Error trying to fetch genre ${genreId} opt`, error);
    }
}
