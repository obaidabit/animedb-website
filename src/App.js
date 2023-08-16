import Home from "./pages/filter home";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Search from "./pages/search";
import About from "./pages/about";
import Anime from "./pages/anime";
import { getTopAPI, getUpcomingAPI } from "./config";
import PagesCard from "./pages/pages card list";
import Schedule from "./pages/schedule";
import Season from "./pages/season";
import DetailsManager from "./components/content/detailsManager";

function App() {
  return (
    <div className="text-gray-700 app font-Lato dark:text-gray-200">
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Anime" element={<Anime />} />
        <Route
          path="/top/page/:number"
          element={<PagesCard title={"Top"} rank={true} api={getTopAPI} />}
        />
        <Route
          path="/upcoming/page/:number"
          element={<PagesCard title={"Upcoming"} api={getUpcomingAPI} />}
        />
        <Route path="/schedule/:day/page/:number" element={<Schedule />} />
        <Route path="/season/page/:number/:year/:season" element={<Season />} />
        <Route path="/details/:id" element={<DetailsManager />} />
        <Route path="/search/:value/page/:number" element={<Search />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer></Footer>
    </div>
  );
}

export default App;
