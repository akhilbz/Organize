import React, { useState, useEffect } from "react";
import { createRoot } from 'react-dom/client';

const container = document.getElementById("react-target");

function Popup() {
  const [currTabs, setCurrTabs] = useState([]);
  const [hostUrls, setHostUrls] = useState([]);
  const collator = new Intl.Collator();

  useEffect(() => {
    async function fetchData() {
      const tabs = await chrome.tabs.query({ currentWindow: true });

      tabs.sort((a, b) => collator.compare(a.title, b.title)); // sort by title
      const hostUrls = new Set(); // set of host URLs (used as category names)

      for (const tab of tabs) {
        const urlHost = new URL(tab.url).hostname;
        hostUrls.add(urlHost);
      }

      // use for debugging:
      // console.log(hostUrls);
      // console.log(tabs);

      setCurrTabs(tabs);
      setHostUrls([...hostUrls]);
    }

    fetchData();
  }, []);

  return (
    <div className="bg-light">
    <nav className="navbar fixed-top bg-light border-bottom">
      <div>
        <a className="navbar-brand mb-1 h1" href="#">Organize</a>
      </div>
    </nav>
    
    <div className="container-fluid">
      <template id="block_template">
        <div className="col-md-4 mb-2">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="title card-title header-text-size">
                Category
              </h4>
              <button className="group btn btn-secondary">Group</button>
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
            <button className="close btn btn-danger">Close</button>
          </div>
        </li>
      </template>

      {hostUrls.map((hostUrl, index) => {
        const hostTabs = currTabs.filter((tab) =>
          tab.url.includes(`://${hostUrl}/`)
        );

        hostTabs.sort((a, b) => collator.compare(a.title, b.title)); // sorts by title for all hostTabs

        return (
          <div key={index} className="col-md-4 mb-2">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h4 className="title card-title header-text-size">{hostUrl}</h4>
                <button className="group btn btn-secondary">Group</button>
              </div>
              <ul className="list-group list-group-flush">
                {hostTabs.map((tab, index) => {
                  const title = tab.title.includes("-") ? tab.title.split("-")[0].trim() : tab.title.includes("|") ? tab.title.split("|")[0].trim() : tab.title;
                  return (
                    <li key={index} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <a href="#"><h5 className="sub-title card-subtitle tab-text-size">{title}</h5></a>
                        <button className="close btn btn-danger" onClick={() => chrome.tabs.remove(tab.id)}>Close</button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
    </div>
  );
}

// export default Popup;

const root = createRoot(container);
root.render(<Popup />);