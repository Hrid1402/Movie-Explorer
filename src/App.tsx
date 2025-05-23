import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import MovieInf from "./pages/MovieInf";
import './styles/App.css'
import Search from "./pages/Search";
import Library from "./pages/Library";
import Explore from "./pages/Explore";
import Person from "./pages/Person";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />}>
          <Route path="/:type/:id" element={<MovieInf />} />
        </Route>
        <Route path="/search" element={<Search />}>
          <Route path=":type/:id" element={<MovieInf />} />
        </Route>
        <Route path="/explore/:type" element={<Explore />}>
          <Route path=":type/:id" element={<MovieInf />} />
        </Route>
        <Route path="/person/:id" element={<Person/>}/>
        <Route path="/library" element={<Library/>}/>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
