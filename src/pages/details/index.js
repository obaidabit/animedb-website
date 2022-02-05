import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDetailsAPI } from "../../config";
import Detail from "../../details";

export default function Details() {
    const params = useParams();
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            await getDetailsAPI(params.id).then((result) =>
                setData(result.data)
            );
        };
        fetchData();
    }, [params.id]);
    return (
        <div className="w-full min-h-screen text-gray-700 dark:text-gray-200">
            <div>
                <div className="w-full h-96 absolute bg-light_primary dark:bg-dark_primary transition-all duration-300 opacity-60 dark:opacity-80"></div>
                {data?.trailer?.images?.maximum_image_url ? (
                    <img
                        className="w-full h-96 object-cover"
                        src={data?.trailer?.images?.maximum_image_url}
                        alt=""
                    />
                ) : (
                    <div className="w-full h-96 transition-all duration-300 bg-light_secondary dark:bg-dark_secondary"></div>
                )}
            </div>
            <div className="w-full h-fit bg-light_primary dark:bg-dark_primary transition-all duration-300 ">
                <div className="container mx-auto flex flex-col">
                    <div className="flex">
                        <img
                            className="rounded-2xl relative h-full -mt-40"
                            src={data?.images?.jpg?.image_url}
                            alt=""
                        />
                        <div className=" px-7 w-full">
                            <h1 className="text-3xl relative font-bold -mt-11">
                                {data.title}
                            </h1>
                            <div className="pt-5 flex justify-between w-full">
                                <div>
                                    <h3 className="text-2xl font-bold">
                                        Synopsis
                                    </h3>
                                </div>
                                <div className="flex gap-5">
                                    <h3 className="text-xl font-bold flex gap-1">
                                        Ranked:{""}
                                        <p className="font-normal">
                                            {data.rank
                                                ? `#${data.rank}`
                                                : " unknown"}
                                        </p>
                                    </h3>
                                    <h3 className="text-xl font-bold flex gap-1">
                                        Popularity: {}
                                        <p className="font-normal">
                                            {data.popularity
                                                ? `#${data.popularity}`
                                                : " unknown"}
                                        </p>
                                    </h3>
                                    <h3 className="text-xl font-bold flex gap-1">
                                        Members: {}
                                        <p className="font-normal">
                                            {data.members
                                                ? data.members
                                                      .toString()
                                                      .replace(
                                                          /\B(?=(\d{3})+(?!\d))/g,
                                                          ","
                                                      )
                                                : " unknown"}
                                        </p>
                                    </h3>
                                </div>
                            </div>
                            <p className="pt-3 text-md text-left">
                                {data.synopsis}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
