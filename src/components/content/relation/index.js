import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import "react-tabs/style/react-tabs.css";
import { getFullDetailsAPI, getRelationsAPI, uuid } from "../../../config";
import CardLoading from "../../card loading";

export default function Relation({ animeId, setTabs, tabs }) {
  const loading = useSelector((state) => state.cardLoading);
  const dispatch = useDispatch();
  const [data, setData] = useState([]);

  function getAnimeFullDataTimeout(results) {
    let counter = 0;
    for (let rel of results.data) {
      if (rel.relation === "Adaptation") continue;
      for (let ent of rel.entry) {
        setTimeout(async () => {
          try {
            const result = await getFullDetailsAPI(ent.mal_id);
            if (result.data)
              setData((prev) =>
                [
                  ...prev,
                  { relation: rel.relation, ...result.data, visited: false },
                ].sort((a, b) =>
                  new Date(a.aired.from) > new Date(b.aired.from) ? 1 : -1
                )
              );
          } catch (error) {
            console.error(error);
          }
        }, 1000 * counter++);
      }
    }
  }

  function showSubRelated(rel) {
    const existedAnime = tabs.find((an) => an.anime.mal_id === rel.mal_id);
    if (existedAnime) return;
    setTabs((prev) => [
      ...prev,
      { animeId: rel.mal_id, id: uuid(), visiable: false, anime: rel },
    ]);
  }

  useEffect(() => {
    let mounted = true;
    dispatch({ type: "LOADING_CARD_TRUE" });
    getRelationsAPI(animeId).then((result) => {
      if (mounted) {
        getAnimeFullDataTimeout(result);
        dispatch({ type: "LOADING_CARD_FALSE" });
      } else {
        return;
      }
    });
    return () => (mounted = false);
  }, [animeId, dispatch]);

  if (loading) return <CardLoading />;
  return (
    <div className="pt-2 pb-5">
      <div className="grid grid-flow-col auto-cols-max overflow-x-scroll gap-3 px-5 pt-5 pb-10 md:px-0 justify-items-center lg:gap-10 sm:gap-5 md:gap-7 card-list">
        {data?.length !== 0 ? (
          data?.map((rel) => {
            if (rel.relation === "Adaptation") return null;
            else
              return (
                <div
                  key={rel.mal_id}
                  id={rel.mal_id}
                  onClick={() => showSubRelated(rel)}
                  className="relative w-32 px-1 text-center py-1 overflow-hidden transition-all duration-200 lg:w-64 lg:px-0 lg:py-0 lg:hover:-translate-y-2 lg:hover:px-1 lg:hover:py-1 bg-light_secondary dark:bg-dark_secondary lg:dark:bg-black lg:hover:bg-light_secondary lg:hover:dark:bg-dark_secondary h-fit card rounded-xl "
                  style={
                    rel.visited
                      ? {
                          outline: "6px",
                          outlineColor: "blue",
                          outlineStyle: "solid",
                        }
                      : null
                  }
                  rel="noreferrer"
                >
                  <img
                    src={rel?.images?.jpg.image_url}
                    alt=""
                    className="object-cover w-full h-52 md:h-52 lg:h-60 xl:h-80 rounded-xl"
                  />
                  <a
                    href={`/details/${rel.mal_id}`}
                    className="text-center mx-auto overflow-hidden w-full text-ellipsis md:max-w-mini lg:whitespace-normal sm:text-black sm:dark:text-white lg:text-white lg:dark:text-black text-sm md:text-lg lg:text-xl font-semibold"
                    rel="noreferrer"
                  >
                    <span className="text-rose-500">{rel?.relation}</span>
                    <br />
                    <span className="text-lg leading-3 md:leading-none">
                      {rel.title}
                    </span>
                  </a>
                </div>
              );
          })
        ) : (
          <h1 className="text-3xl">Not Available</h1>
        )}
      </div>
    </div>
  );
}
