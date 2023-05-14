import React, { useState, useEffect } from "react";
// import { PopupContext } from "./global_context";
import DisplayTabs from "./display_tabs.js";
import { createRoot } from 'react-dom/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const container = document.getElementById("react-target");

// TODO: move this into a separate file
 function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
}

 function Popup() {
  const [currGroups, setCurrGroups] = useState([]);
  const [currTabs, setCurrTabs] = useState([]);
  const [hostUrls, setHostUrls] = useState([]);
  const collator = new Intl.Collator();

  useEffect(() => {
    async function fetchData() {
      const tabs = await chrome.tabs.query({ currentWindow: true });
      const groups = await chrome.tabGroups.query({ windowId: chrome.windows.WINDOW_ID_CURRENT })
      groups.sort((a, b) => collator.compare(a.title, b.title));
      tabs.sort((a, b) => collator.compare(a.title, b.title)); // sort by title
      const hostUrls = new Set(); // set of host URLs (used as category names)

      for (const tab of tabs) {
        const urlHost = new URL(tab.url).hostname;
        hostUrls.add(urlHost);
      }

      // use for debugging:
      // console.log(hostUrls);
      // console.log(tabs);
      // console.log(groups);

      setCurrTabs(tabs);
      setHostUrls([...hostUrls]);
      setCurrGroups([...groups]); 
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
      <template id="group_template">
      <div className="col-md-4 mb-2">
        <div className="card">
          <div className="card-header d-flex justify-content-between">
            <h4 className="title card-title header-text">
                Category
              </h4>           
              <button>Settings</button>
          </div>
        </div>
      </div>
      </template>
      <template id="block_template">
        <div className="col-md-4 mb-2">
          <div className="card">
            <div className="card-header d-flex justify-content-between">
              <h4 className="title card-title header-text">
                Category
              </h4>           
              <button className="group">Settings</button>
            </div>
            <ul className="list-group list-group-flush"></ul>
          </div>
        </div>
      </template>

      <template id="li_template">
        <li className="list-group-item">
          <div className="d-flex justify-content-between align-items-center">
            <a>
              <h5 className="sub-title card-subtitle tab-text-size">
                Tab Title
              </h5>
            </a>
            <button className="close btn">Close</button>
          </div>
        </li>
      </template>
      <DisplayTabs currTabs={currTabs} hostUrls={hostUrls} collator={collator} />
      </div>
    </div>
  );
}

const root = createRoot(container);
root.render(<Popup />);
