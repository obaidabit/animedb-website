import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getVideosAPI } from "../../../config";
import { useSelector, useDispatch } from "react-redux";
import ContentLoading from "../../content loading";

export default function Videos({ animeId }) {
  const params = useParams();
  const [data, setData] = useState([]);
  const loading = useSelector((state) => state.contentLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    let mounted = true;
    dispatch({ type: "LOADING_CONTENT_TRUE" });
    getVideosAPI(animeId).then((result) => {
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
    <div className="flex flex-col gap-10 pt-10 pb-5">
      {loading ? (
        <ContentLoading></ContentLoading>
      ) : data?.promo?.length !== 0 ? (
        data?.promo?.map((data) => (
          <div className="flex flex-col" key={Math.floor(Math.random() * 1000)}>
            <p className="py-5 text-3xl">{data?.title}</p>
            <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden">
              <iframe
                src={data?.trailer?.embed_url}
                title={data?.title}
                frameBorder="0"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        ))
      ) : (
        <h1 className="text-3xl">Not Available</h1>
      )}
    </div>
  );
}
