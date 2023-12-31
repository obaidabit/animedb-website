import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEpisodesAPI } from "../../../config";
import { useSelector, useDispatch } from "react-redux";
import ContentLoading from "../../content loading";

export default function Episodes({ animeId }) {
  const params = useParams();
  const [data, setData] = useState([]);
  const loading = useSelector((state) => state.contentLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    let mounted = true;
    dispatch({ type: "LOADING_CONTENT_TRUE" });
    getEpisodesAPI(animeId).then((result) => {
      if (mounted) {
        setData(result.data);
        dispatch({ type: "LOADING_CONTENT_FALSE" });
      } else {
        return;
      }
    });
    return () => (mounted = false);
  }, [animeId, dispatch]);
  return (
    <div className="flex flex-col items-start w-full pt-10 gap-7 md:gap-5">
      {loading ? (
        <ContentLoading></ContentLoading>
      ) : data?.length !== 0 ? (
        data?.map((data) => (
          <div
            key={Math.floor(Math.random() * 1000008)}
            className="text-2xl py-2 grid md:gap-2 gap-3 md:grid-cols-[0.5fr,0.5fr,1fr,1.5fr] lg:grid-cols-[0.5fr,0.5fr,1fr,1fr]"
          >
            <p className="min-w-[10ch]">Episode : {data?.mal_id}</p>
            <p className="lg:min-w-[30ch] min-w-[13ch] md:max-w-[25ch] lg:max-w-[35ch] max-w text-ellipsis whitespace-nowrap overflow-hidden">
              Title :{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 decoration-1"
                href={data?.url}
              >
                {data?.title}
              </a>
            </p>
            <p className="overflow-hidden lg:px-10 max-w-fit md:max-w-[15ch] lg:max-w-fit text-ellipsis whitespace-nowrap">
              Aired : {data?.aired ? data?.aired : "NA"}
            </p>
            <p>
              Discussion :{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 decoration-1"
                href={data?.forum_url}
              >
                Forum
              </a>
            </p>
          </div>
        ))
      ) : (
        <h1 className="text-3xl">Not Available</h1>
      )}
    </div>
  );
}
