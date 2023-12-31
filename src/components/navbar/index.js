import React, { useEffect, useState, useRef } from "react";
import MobileNav from "../mobile/mobilenav";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

export default function Navbar() {
  const menuRef = useRef(null);
  const [showDropDown, setShowDropDown] = useState(false);
  const [listening, setListening] = useState(false);
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const toggleDropDown = () => {
    setShowDropDown(!showDropDown);
  };

  const handleChangeValue = (e) => {
    setValue(e.target.value);
    e.target.addEventListener("keypress", (e) => {
      if (e.keyCode === 13) {
        document.getElementById("search").click();
      }
    });
  };
  const handleSubmit = () => {
    if (value !== "") {
      navigate(`/search/${value}/page/1`);
      setValue("");
    }
  };

  const theme = () => {
    if (localStorage.dark === "false") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("dark", true);
      dispatch({ type: "DARK_MODE" });
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("dark", false);
      dispatch({ type: "LIGHT_MODE" });
    }
  };

  useEffect(() => {
    if (localStorage.dark === "true") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    if (listening) return;
    if (!menuRef.current) return;
    setListening(true);
    [`click`, `touchstart`].forEach((type) => {
      document.addEventListener(`click`, (evt) => {
        const cur = menuRef.current;
        const node = evt.target;
        if (!node || !cur) return;
        if (cur.contains(node)) return;
        setShowDropDown(false);
      });
    });
  }, [listening]);

  return (
    <nav className="h-16 py-3 transition-all duration-300 bg-light_primary dark:bg-dark_primary">
      <div
        ref={menuRef}
        className="container flex justify-between px-5 mx-auto text-gray-700 dark:text-gray-200"
      >
        <div className="hidden md:block">
          <h1 className="text-2xl font-bold m-0">Anime Info</h1>
        </div>
        <div onClick={toggleDropDown} className="cursor-pointer sm:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-9 w-9"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h8m-8 6h16"
            />
          </svg>
        </div>
        <div className="hidden gap-5 mt-1 sm:flex">
          <Link className="text-xl font-medium " to="/">
            Home
          </Link>
          <Link className="text-xl font-medium " to="anime">
            Anime
          </Link>
          <Link className="text-xl font-medium " to="anilist">
            Anilist
          </Link>
        </div>
        <div className="flex items-center h-9 w-1/2 md:w-1/4 bg-white dark:bg-gray-500 rounded-lg transition-all duration-300">
          <div className="w-full">
            <input
              type="search"
              className="w-full px-4 py-1 dark:text-gray-200 text-gray-800 dark:bg-gray-500 rounded-full focus:outline-none transition-colors duration-300"
              placeholder="search anime"
              onChange={(e) => handleChangeValue(e)}
              value={value}
            ></input>
          </div>
          <div>
            <button
              type="submit"
              id="search"
              name="search"
              onClick={handleSubmit}
              className="flex items-center bg-light_secondary h-9 dark:bg-dark_secondary justify-center w-12 transition-all duration-300 text-white rounded-r-lg"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </button>
          </div>
        </div>
        <div className="mt-2">
          <button
            title="Toggle Theme"
            onClick={theme}
            className="
            w-12 
            h-6 
            rounded-full 
            bg-light_primary 
            border-dark_primary
                dark:bg-dark_primary
                dark:border-light_primary
                border-2
            relative 
            transition-colors 
            duration-500 
            ease-in
            focus:outline-none 
            focus:ring-1 
            focus:ring-dark_primary
            dark:focus:ring-light_primary 
        "
          >
            <div
              id="toggle"
              className="
                rounded-full 
                w-4 
                h-4 
                bg-dark_primary 
                dark:bg-light_primary 
                relative 
                ml-1 
                dark:ml-6 
                pointer-events-none 
                transition-all 
                duration-300 
                ease-out
            "
            ></div>
          </button>
        </div>
      </div>
      <div
        className={`w-full h-screen top-0 ${
          showDropDown ? "inline-block" : "hidden"
        } fixed bg-black opacity-50 z-40`}
      ></div>
      <MobileNav onClick={toggleDropDown} show={showDropDown}></MobileNav>
    </nav>
  );
}
