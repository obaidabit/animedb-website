import React, { useEffect, useState, useCallback } from "react";
import { getFullDetailsAPI } from "../../config";
import { useSelector, useDispatch } from "react-redux";
import Videos from "../../components/content/videos";
import Episodes from "../../components/content/Episodes";
import Reviews from "../../components/content/reviews";
import Recommendation from "../../components/content/recommendations";
import Stats from "../../components/content/stats";
import CharacterStaff from "../../components/content/character & staff";
import MoreInfo from "../../components/content/more info";
import DetailsLoading from "../../components/details loading";
import MobileContentNav from "../../components/mobile/mobilenav content";
import Relation from "../../components/content/relation";

function viewDate(date) {
  if (!date) return null;
  const dateFormatter = new Intl.DateTimeFormat("en-GB", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
  return dateFormatter.format(new Date(date));
}
export default function Details({ animeId, setTabs, tabs, deleteTab, id }) {
  const [data, setData] = useState([]);
  const [content, setContent] = useState(0);
  const [contentNav, setContentNav] = useState(true);
  const loading = useSelector((state) => state.detailsLoading);
  const [isVisible, setIsVisible] = useState(true);
  const [resources, setResources] = useState(false);

  const dispatch = useDispatch();

  const toggleContentNav = () => {
    setContentNav(!contentNav);
    contentNav ? setContent(5) : setContent(1);
  };

  const switchContent = useCallback((index) => {
    setContent(index);
  }, []);

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const listenToScroll = () => {
      let heightToShowFrom = 5000;
      const winScroll =
        document.body.scrollTop || document.documentElement.scrollTop;
      if (winScroll > heightToShowFrom) {
        // to limit setting state only the first time
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    setIsVisible(false);
    window.addEventListener("scroll", listenToScroll);
    return () => window.removeEventListener("scroll", listenToScroll);
  }, []);

  useEffect(() => {
    let mounted = true;
    scrollTop();
    dispatch({ type: "LOADING_DETAILS_TRUE" });
    getFullDetailsAPI(animeId).then((result) => {
      if (mounted) {
        setData(result.data);
        switchContent(8);
        dispatch({ type: "LOADING_DETAILS_FALSE" });
      } else {
        return;
      }
    });
    return () => (mounted = false);
  }, [animeId, dispatch, switchContent]);

  function sortTabs() {
    setTabs((prev) => {
      const sorted = [...prev].sort((a, b) => {
        const aDate = a.anime.aired.from
          ? new Date(a.anime.aired.from)
          : Infinity;
        const bDate = b.anime.aired.from
          ? new Date(b.anime.aired.from)
          : Infinity;

        if (aDate === Infinity && bDate === Infinity) {
          return 0;
        }
        if (aDate === Infinity) {
          return 1;
        }
        if (bDate === Infinity) {
          return -1;
        }

        return aDate - bDate;
      });

      return sorted;
    });
  }
  return (
    <div className="w-full min-h-screen text-gray-700 dark:text-gray-200">
      {loading && <DetailsLoading></DetailsLoading>}
      {!loading && (
        <div>
          <div>
            <div className="text-right pr-4 absolute w-full z-50">
              <button
                onClick={() => deleteTab({ id: id })}
                className="py-1 mt-2 px-3 rounded-md bg-red-600 text-white mr-2 absolute right-0"
              >
                Close
              </button>
              <button
                onClick={() => sortTabs({ id: id })}
                className="py-1 mt-2 px-3 rounded-md bg-green-400 text-black ml-2 absolute left-0"
              >
                Sort
              </button>
            </div>
            <div className="absolute w-full transition-all duration-300 h-80 bg-light_primary dark:bg-dark_primary opacity-60 dark:opacity-80"></div>
            {data?.trailer?.images?.maximum_image_url ||
            data?.images?.jpg?.large_image_url ? (
              <img
                className="object-cover w-full h-80"
                src={
                  data?.trailer?.images?.maximum_image_url ||
                  data?.images?.jpg?.large_image_url
                }
                alt=""
              />
            ) : (
              <div className="w-full transition-all duration-300 h-96 bg-light_secondary dark:bg-dark_secondary"></div>
            )}
          </div>
          <div className="w-full transition-all duration-300 h-fit bg-light_primary dark:bg-dark_primary">
            <div className="container flex flex-col mx-auto">
              <div className="flex flex-col items-center w-full px-5 md:items-start lg:items-start md:flex-row">
                <div className="md:flex -mt-64 md:-mt-64 md:flex-col md:items-center md:gap-10">
                  <div className="flex items-center">
                    <img
                      className="relative portrait:w-52 portrait:h-64 h-96 md:h-full md:max-w-xs rounded-2xl "
                      src={
                        data?.images?.jpg?.large_image_url ||
                        data?.images?.jpg?.image_url
                      }
                      alt=""
                    />
                  </div>
                  <div
                    className={`flex-col items-center hidden w-2/3 px-2 py-2 transition-colors duration-300 ${
                      data?.score
                        ? data?.score > 7.5
                          ? "bg-green-400 dark:bg-green-600"
                          : data?.score > 6
                          ? "bg-yellow-400 dark:bg-yellow-600"
                          : "bg-red-400 dark:bg-red-600"
                        : "bg-gray-400 dark:bg-gray-600"
                    } md:flex xl:hidden rounded-2xl `}
                  >
                    <p className="font-bold text-md">SCORE</p>

                    <div className="flex items-end font-bold">
                      <p className="text-5xl">
                        {data?.score ? Math.floor(data?.score) : "NA"}
                      </p>
                      <p className="text-3xl">
                        {data?.score
                          ? (data?.score - Math.floor(data?.score))
                              .toFixed(2)
                              .toString()
                              .replace("0", "")
                          : ""}
                      </p>
                    </div>
                    <p className="font-normal dark:font-light ">
                      {data?.scored_by
                        ? ` ${data?.scored_by
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} users`
                        : "NA"}
                    </p>
                  </div>
                </div>
                <div className="w-full px-7 md:-mt-2 ">
                  <div className="relative flex flex-col gap-2 justify-between items-center w-full pt-2 lg:flex-row">
                    <div>
                      <h1 className="relative mb-4 text-2xl  font-bold text-center  md:overflow-hidden md:text-ellipsis md:text-3xl md:text-left md:max-w-read lg:max-w-full ">
                        {data?.title}
                      </h1>
                      <p className="text-md">
                        English:{" "}
                        <span className="ml-2 font-bold">
                          {data?.title_english}
                        </span>
                      </p>
                      <p className="text-md">
                        Japanese:{" "}
                        <span className="ml-2 font-bold">
                          {data?.title_japanese}
                        </span>
                      </p>
                    </div>
                    <button
                      className="z-10 bg-amber-200 px-3 py-2 dark:text-black rounded whitespace-nowrap"
                      onClick={() => setResources((prev) => !prev)}
                    >
                      Show Resources
                    </button>
                    {resources ? (
                      <div className="z-10 flex gap-1 mt-3 flex-col flex-wrap lg:flex-row md:absolute right-0 top-16">
                        <a
                          href={`https://anilist.co/anime/${data?.mal_id}/`}
                          className="bg-blue-600 hover:bg-blue-500  text-white font-bold py-2 px-4 rounded z-50"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Anilist
                        </a>
                        {data?.external?.map((it) => (
                          <a
                            key={Math.floor(Math.random() * 1000)}
                            href={it?.url}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded z-50"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {it?.name}
                          </a>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <details className="flex flex-col items justify-between w-full pt-5 lg:flex-row">
                    <summary className=" font-bold text-center md:text-left flex flex-col md:flex-row justify-between">
                      <span className="text-2xl cursor-pointer">Synopsis</span>
                      <div className="mt-2 md:text-lg text-md md:mt-0 flex flex-col items-center justify-center order-1 gap-3 md:flex-row md:justify-start lg:order-2 lg:gap-5">
                        <h3 className="flex gap-1 text-md font-bold">
                          Ranked:{""}
                          <p className="font-normal">
                            {data?.rank ? `#${data?.rank}` : " NA"}
                          </p>
                        </h3>
                        <h3 className="flex gap-1 text-md font-bold">
                          Popularity: {}
                          <p className="font-normal">
                            {data?.popularity ? `#${data?.popularity}` : " NA"}
                          </p>
                        </h3>
                        <h3 className="flex gap-1 text-md font-bold">
                          Members: {}
                          <p className="font-normal">
                            {data?.members
                              ? data?.members
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                              : " NA"}
                          </p>
                        </h3>
                      </div>
                    </summary>
                    <div className="order-2 mt-3 md:mt-0 lg:order-1"></div>

                    <p className=" md:pr-5 lg:max-w-full lg:min-h-[18rem] xl:min-h-[7rem] md:max-w-synopsis lg:pr-0 text-justify mx-auto self-center md:text-left text-md">
                      {data?.synopsis}
                    </p>
                  </details>
                </div>
              </div>
              <div className="flex flex-col items-center justify-between w-full gap-4 md:gap-10 px-5 pb-10 xl:flex-row pt-3 md:pt-7">
                <div
                  className={`flex md:hidden w-1/2 xl:flex xl:w-[11%]  justify-center flex-col items-center rounded-2xl transition-colors duration-300 py-1 px-1  ${
                    data?.score
                      ? data?.score > 7.5
                        ? "bg-green-400 dark:bg-green-600"
                        : data?.score > 6
                        ? "bg-yellow-400 dark:bg-yellow-600"
                        : "bg-red-400 dark:bg-red-600"
                      : "bg-gray-400 dark:bg-gray-600"
                  }`}
                >
                  <p className="font-bold text-md">SCORE</p>

                  <div className="flex items-end font-bold">
                    <p className="text-5xl">
                      {data?.score ? Math.floor(data?.score) : "NA"}
                    </p>
                    <p className="text-3xl">
                      {data?.score
                        ? (data?.score - Math.floor(data?.score))
                            .toFixed(2)
                            .toString()
                            .replace("0", "")
                        : ""}
                    </p>
                  </div>
                  <p className="font-normal dark:font-light ">
                    {data?.scored_by
                      ? ` ${data?.scored_by
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} users`
                      : "NA"}
                  </p>
                </div>
                <div className="flex portrait:flex-col lg:flex-col items-start w-full border-2 border-gray-700 lg:flex dark:border-gray-200 justify-evenly rounded-xl">
                  <div className="flex flex-col items-center justify-center w-full gap-2 p-5 text-md xl:text-sm xl:flex-row">
                    <p className="flex gap-1 font-bold">
                      Type :
                      <span className="font-normal dark:font-light">
                        {data?.type ? data?.type : "unknown"}
                      </span>
                    </p>
                    <p className="flex gap-1 font-bold">
                      Episode :
                      <span className="font-normal dark:font-light">
                        {data?.episodes ? data?.episodes : "unknown"}
                      </span>
                    </p>
                    <p className="gap-1 font-bold text-center md:flex">
                      Theme :
                      <span className="font-normal dark:font-light">
                        {data?.themes
                          ? data?.themes.map((data) => data?.name).join(",")
                          : "unknown"}
                      </span>
                    </p>
                    <p className="flex gap-1 font-bold">
                      Duration :
                      <span className="font-normal dark:font-light">
                        {data?.duration ? data?.duration : "unknown"}
                      </span>
                    </p>
                    <p className="flex gap-1 font-bold">
                      Source :
                      <span className="font-normal dark:font-light">
                        {data?.source ? data?.source : "unknown"}
                      </span>
                    </p>
                    <p className="flex gap-1 font-bold">
                      Premiered :
                      <span className="font-normal dark:font-light">
                        {data?.season && data?.year
                          ? data?.season + " " + data?.year
                          : "unknown"}
                      </span>
                    </p>
                    <p className="flex gap-1 font-bold">
                      Demographic :
                      <span className="font-normal dark:font-light">
                        {data?.demographics && data?.demographics.length
                          ? data?.demographics[0].name
                          : "unknown"}
                      </span>
                    </p>
                  </div>
                  <div className="w-full hidden portrait:block lg:block bg-gray-700 dark:bg-gray-200 h-[1px]"></div>
                  <div className="flex flex-col items-center justify-center w-full gap-2 p-5 text-md xl:text-sm xl:flex-row">
                    <p className="flex gap-1 font-bold">
                      Status :
                      <span className="font-normal dark:font-light">
                        {data?.status ? data?.status : "unknown"}
                      </span>
                    </p>
                    <p className="flex gap-1 font-bold">
                      Aired :
                      <span className="font-normal dark:font-light">
                        {viewDate(data?.aired?.from)}
                        {data?.aired?.to
                          ? " to " + viewDate(data?.aired?.to)
                          : null}
                      </span>
                    </p>
                    <p className="flex gap-1 font-bold">
                      Broadcast :
                      <span className="font-normal dark:font-light">
                        {data?.broadcast?.string
                          ? data?.broadcast.string
                          : "unknown"}
                      </span>
                    </p>
                    <p className="flex gap-1 font-bold">
                      Studios :
                      <a href="/" className="font-normal dark:font-light">
                        {data?.studios
                          ? data?.studios.length !== 0
                            ? data?.studios.map((data) => data?.name).join(",")
                            : "unknown"
                          : "unknown"}
                      </a>
                    </p>
                    <p className="flex gap-1 font-bold">
                      Rating :
                      <span className="font-normal dark:font-light">
                        {data?.rating ? data?.rating : "unknown"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full px-2 md:px-5 py-10 min-h-fit">
            <div className="flex flex-row justify-around w-full mx-auto md:justify-between">
              <button
                onClick={() => switchContent(1)}
                className={`uppercase border-b-4 ${
                  contentNav ? "md:block" : "md:hidden"
                } border-b-transparent hover:border-b-4 lg:block hover:border-b-light_secondary hover:dark:border-b-dark_secondary pb-2 ${
                  content === 1
                    ? "block border-b-4 border-b-light_secondary dark:border-b-dark_secondary"
                    : "hidden border-b-4 border-b-transparent"
                } font-bold text-xl`}
              >
                Videos
              </button>
              <button
                onClick={() => switchContent(2)}
                className={`uppercase border-b-4 ${
                  contentNav ? "md:block" : "md:hidden"
                } border-b-transparent hover:border-b-4 lg:block hover:border-b-light_secondary hover:dark:border-b-dark_secondary pb-2 ${
                  content === 2
                    ? "block border-b-4 border-b-light_secondary dark:border-b-dark_secondary"
                    : "hidden border-b-4 border-b-transparent"
                } font-bold text-xl`}
              >
                Episodes
              </button>
              <button
                onClick={() => switchContent(4)}
                className={`uppercase border-b-4 ${
                  contentNav ? "md:block" : "md:hidden"
                } border-b-transparent hover:border-b-4 lg:block hover:border-b-light_secondary hover:dark:border-b-dark_secondary  pb-2 ${
                  content === 4
                    ? "block border-b-4 border-b-light_secondary dark:border-b-dark_secondary"
                    : "hidden border-b-4 border-b-transparent"
                } font-bold text-xl`}
              >
                recommendations
              </button>
              <button
                onClick={() => switchContent(8)}
                className={`uppercase self-end border-b-4 ${
                  contentNav ? "md:hidden" : "md:block"
                } lg:block border-b-transparent hover:border-b-4 hover:border-b-light_secondary hover:dark:border-b-dark_secondary  pb-2 ${
                  content === 7
                    ? "block border-b-4 border-b-light_secondary dark:border-b-dark_secondary"
                    : "hidden border-b-4 border-b-transparent"
                } font-bold text-xl`}
              >
                Related
              </button>
              <button className="hidden pb-2 border-b-4 md:block lg:hidden border-b-transparent hover:border-b-light_secondary hover:dark:border-b-dark_secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-7 h-7 "
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  onClick={toggleContentNav}
                >
                  <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
                </svg>
              </button>
              <button
                onClick={() => switchContent(6)}
                className={`uppercase border-b-4 ${
                  contentNav ? "md:hidden" : "md:block"
                } lg:block border-b-transparent hover:border-b-4 hover:border-b-light_secondary hover:dark:border-b-dark_secondary  pb-2 ${
                  content === 6
                    ? "block border-b-4 border-b-light_secondary dark:border-b-dark_secondary"
                    : "hidden border-b-4 border-b-transparent"
                } font-bold text-xl`}
              >
                Characters
              </button>
              <MobileContentNav
                content1={() => switchContent(1)}
                content2={() => switchContent(2)}
                content3={() => switchContent(3)}
                content4={() => switchContent(4)}
                content5={() => switchContent(5)}
                content6={() => switchContent(6)}
                content7={() => switchContent(7)}
                content8={() => switchContent(8)}
              ></MobileContentNav>
            </div>
            <div className=" flex flex-col mx-auto min-h-[500px]">
              <div>{content === 1 && <Videos animeId={animeId}></Videos>}</div>
              <div>
                {content === 2 && <Episodes animeId={animeId}></Episodes>}
              </div>
              <div>
                {content === 3 && <Reviews animeId={animeId}></Reviews>}
              </div>
              <div>
                {content === 4 && (
                  <Recommendation animeId={animeId}></Recommendation>
                )}
              </div>
              <div>{content === 5 && <Stats animeId={animeId}></Stats>}</div>
              <div>
                {content === 6 && (
                  <CharacterStaff animeId={animeId}></CharacterStaff>
                )}
              </div>
              <div>
                {content === 7 && <MoreInfo animeId={animeId}></MoreInfo>}
              </div>
              <div>
                {content === 8 && (
                  <Relation
                    animeId={animeId}
                    tabs={tabs}
                    setTabs={setTabs}
                  ></Relation>
                )}
              </div>
              {isVisible && (
                <button
                  onClick={scrollTop}
                  className="fixed left-0 right-0 flex flex-col items-center mx-auto text-center bottom-10 animate-bounce"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 15.707a1 1 0 010-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414 0zm0-6a1 1 0 010-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L10 5.414 5.707 9.707a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p>Back To Top ?</p>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
