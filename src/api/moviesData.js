import axios from "axios";

export async function getTrendingMovies(page, time, language){
    try {
        const data = await axios.get(`https://api.themoviedb.org/3/trending/all/${time}?language=${language}&page=${page}`,{
            headers:{
                Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
            }
        })
        return data.data;
    } catch (error) {
        console.log('Error trying to fetch trending movies', error.error);
    }
}

export async function getMovieDataById(type, id, language) {
    try {
        const data = await axios.get(`https://api.themoviedb.org/3/${type}/${id}?language=${language}`,{
            headers:{
                Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
            }
        });
        return data.data;
    } catch (error) {
        console.log('Error trying to fetch movie by id', error.error);
    }
}

export async function getSimilarMovies(type, id, language){
    try {
        const data = await axios.get(`https://api.themoviedb.org/3/${type}/${id}/similar?language=${language}`,{
            headers:{
                Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
            }
        });
        return data.data;
    } catch (error) {
        console.log('Error trying to fetch movie by id', error.error);
    }
}

export async function getSeasonData(type, id, season_number, language) {
    try {
        const data = await axios.get(`https://api.themoviedb.org/3/${type}/${id}/season/${season_number}?language=${language}`,{
            headers:{
                Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
            }
        });
        return data.data;
    } catch (error) {
        console.log('Error trying to fetch season data', error.error);
    }
}


export async function getMovieImages(type, id, language) {
    try {
        const data = await axios.get(`https://api.themoviedb.org/3/${type}/${id}/images?language=${language}`,{
            headers:{
                Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
            }
        });
        const images = data.data;
        if(images.logos && images.logos[0]){
            return images.logos[0];
        }else{
            const original = await axios.get(`https://api.themoviedb.org/3/${type}/${id}/images`,{
                headers:{
                    Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
                }
            });
            return original.data.logos[0]
        }
    } catch (error) {
        console.log('Error trying to fetch movie images', error.error);
    }
}
export async function getMovieCast(type, id){
    try {
        const data = await axios.get(`https://api.themoviedb.org/3/${type}/${id}/credits`,{
            headers:{
                Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
            }
        });
        return data.data.cast.slice(0, 10);
    } catch (error) {
        console.log('Error trying to fetch movie cast', error.error);
    }
}

export async function getMovieTrailer(type, id, language) {
    try {
        const data = await axios.get(`https://api.themoviedb.org/3/${type}/${id}/videos?language=${language}`,{
            headers:{
                Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
            }
        });
        const trailers = data.data.results;
        let finalTrailers = [];
        finalTrailers = trailers.filter(t => t.official === true && (t.type === "Trailer" || t.type === "Teaser " || t.type === "Clip" || t.type === "Opening Credits"));

        if(finalTrailers.length > 0){
            finalTrailers.sort((a, b) => (a.type === "Trailer" ? -1 : 1));
            return finalTrailers
        }else{
            const ogData = await axios.get(`https://api.themoviedb.org/3/${type}/${id}/videos`,{
                headers:{
                    Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
                }
            });
            const oGTrailers = ogData.data.results;
            finalTrailers = oGTrailers.filter(t => t.official === true && (t.type === "Trailer" || t.type === "Teaser " || t.type === "Clip" || t.type === "Opening Credits"));
            finalTrailers.sort((a, b) => (a.type === "Trailer" ? -1 : 1));
            return finalTrailers
        }
        
    } catch (error) {
        console.log('Error trying to fetch movie trailer', error.error);
    }
}