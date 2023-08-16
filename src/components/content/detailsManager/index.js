import React, { useEffect } from "react";
import Details from "../../../pages/details";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useParams } from "react-router-dom";
import { getFullDetailsAPI, uuid } from "../../../config";
import { useHomeTabs } from "../../../hooks/HomeContext";

export default function DetailsManager() {
  const params = useParams();
  const { tabs, setTabs } = useHomeTabs();

  function deleteTab(rel) {
    setTabs((prev) => prev.filter((ent) => ent.id !== rel.id));
  }

  useEffect(() => {
    getFullDetailsAPI(params.id).then((res) => {
      if (tabs.length !== 0 && tabs[0].animeId !== params.id)
        return setTabs([
          { animeId: params.id, id: uuid(), visiable: true, anime: res.data },
        ]);

      if (tabs.length === 0)
        setTabs((prev) => [
          ...prev,
          { animeId: params.id, id: uuid(), visiable: true, anime: res.data },
        ]);
    });
  }, []);

  return (
    <>
      <Tabs>
        <TabList
          id="tabs"
          className="overflow-x-auto flex w-full thin-scroll py-2"
        >
          {tabs.map((rel) => (
            <Tab
              key={rel.id}
              className="whitespace-nowrap py-2 px-4 rounded-lg border-r-4 border-r-gray-500 cursor-pointer"
              selectedClassName="bg-amber-200 dark:text-black "
            >
              {rel?.anime?.title}
            </Tab>
          ))}
        </TabList>

        {tabs.map((rel) => (
          <TabPanel key={rel.id}>
            <Details
              id={rel.id}
              animeId={rel.animeId}
              deleteTab={deleteTab}
              setTabs={setTabs}
            />
          </TabPanel>
        ))}
      </Tabs>
    </>
  );
}
