import React, { useState, useEffect } from "react";
import DisplayTabs from "./Helper/display_tabs.js";
import DisplayGroups from "./Helper/display_groups.js";
import { getHostUrls } from "./Helper/helper_functions.js";
// import AllTemplates from "./Helper/templates.js";
import { createRoot } from 'react-dom/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const container = document.getElementById("react-target");

 function Popup() {
  const [currGroups, setCurrGroups] = useState([]);
  const [currGroupTabs, setCurrGroupTabs] = useState([]);
  const [currTabs, setCurrTabs] = useState([]);
  const [hostUrls, setHostUrls] = useState([]);
  const collator = new Intl.Collator();

  useEffect(() => {
    async function fetchData() {
      const tabs = await chrome.tabs.query({ currentWindow: true });
      const groups = await chrome.tabGroups.query({ windowId: chrome.windows.WINDOW_ID_CURRENT });
      groups.sort((a, b) => collator.compare(a.title, b.title));
      tabs.sort((a, b) => collator.compare(a.title, b.title)); // sort by title

      
      const tabsInGroups = []; // set of tabs in each group

      // Get all hostUrls
      const hostUrls = getHostUrls(tabs); // set of host URLs (used as category names)
      // console.log(hostUrls);
      // Store all tabs of each current group in an array
      for (const group of groups) {
        const tabs_in_group = await chrome.tabs.query({groupId: group.id});
        tabsInGroups.push(tabs_in_group);
      }
       
      // console.log(tabsInGroups);
     

      // use for debugging:
      // console.log(hostUrls);
      // console.log(tabs);
      // console.log(groups);

      setCurrTabs(tabs);
      setHostUrls([...hostUrls]);
      setCurrGroups([...groups]); 
      setCurrGroupTabs([...tabsInGroups]);
    }

    fetchData();
  }, []);

  // console.log(hostURLs);
  // console.log(currTabs);

  return (
    <div className="main_body">
    <nav className="navbar fixed-top border-bottom">
      <div><a className="navbar-brand mb-2 h1" href="#">Organize</a></div>
      <button className="search "><FontAwesomeIcon icon={faSearch} style={{ color: '#000000' }} className="fa-search fa-thin fa-lg" /></button>
    </nav>
    
    <div className="container-fluid">
      <div className="groups-section border-bottom">
      <h5 className="group-head">Groups</h5>
       {/* Make a collapsable feature here to collapse DisplayGroups */}
      <DisplayGroups currGroups={currGroups} setCurrGroups={setCurrGroups} currGroupTabs={currGroupTabs} collator={collator} />
      </div>
      <h5 className="tab-head">Tabs</h5>
      <DisplayTabs currGroups={currGroups} setCurrGroups={setCurrGroups} currGroupTabs={currGroupTabs} 
      setCurrGroupTabs={setCurrGroupTabs} currTabs={currTabs} setCurrTabs={setCurrTabs} hostUrls={hostUrls} 
      setHostUrls={setHostUrls} collator={collator} />
      </div>
    </div>
  );
}

const root = createRoot(container);
root.render(<Popup />);
