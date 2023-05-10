import React, { useState, useEffect } from "react";
import { createRoot } from 'react-dom/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import chrome_logo from '/Users/akhileshbitla/Work/products/Organize/src/images/chrome_icon.png';
import extension_logo from '/Users/akhileshbitla/Work/products/Organize/src/images/extension_icon.png';

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
    <div className="main_body">
    <nav className="navbar fixed-top border-bottom">
      <div><a className="navbar-brand mb-2 h1" href="#">Organize</a></div>
      <button className="search "><FontAwesomeIcon icon={faSearch} style={{ color: '#000000' }} className="fa-thin fa-lg" /></button>
    </nav>
    
    <div className="container-fluid">
      <template id="block_template">
        <div className="col-md-4 mb-2">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="title card-title header-text-size">
                Category
              </h4>
              <button className="group">Group</button>
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

      {hostUrls.map((hostUrl, index) => {
        const hostTabs = currTabs.filter((tab) => tab.url.includes(`://${hostUrl}/`)); // tab refers to the tab of each currTabs

        hostTabs.sort((a, b) => collator.compare(a.title, b.title)); // sorts by title for all hostTabs
        console.log(hostTabs);
        let favIcon_img = hostTabs[0].favIconUrl;
        if (hostTabs[0].url.includes("chrome://newtab/")) { 
          favIcon_img = require('/Users/akhileshbitla/Work/products/Organize/src/images/chrome_icon.png').default;
        } else if (hostTabs[0].url.includes("chrome://extensions/")) {
          favIcon_img = require('/Users/akhileshbitla/Work/products/Organize/src/images/extension_icon.png').default;
      }

        return (
          <div key={index} className="col-md-4 mb-2">
            <div className="card">
              <div id="main_card_header" className="card-header d-flex justify-content-between align-items-center">
                <div className="websitelogo"><img className="favicon" src={favIcon_img} alt="" />
                </div>

                <h4 className="title card-title header-text-size">{hostUrl}</h4>

                <button className="group" onClick= { async () => {
                  const tabIds = hostTabs.map(({ id }) => id);
                  const group = await chrome.tabs.group({ tabIds });
                  await chrome.tabGroups.update(group, { title: 'DOCS' });
                }}><FontAwesomeIcon icon={faLayerGroup} style={{ color: "#000000" }} className="fa-thin fa-lg" /></button>

              </div>

              <ul className="list-group list-group-flush">
                {hostTabs.map((tab, index) => {
                  const title = tab.title.includes("-") ? tab.title.split("-")[0].trim() : tab.title.includes("|") ? tab.title.split("|")[0].trim() : tab.title;
                  const tab_url = new URL(tab.url).pathname;
                  const curr_tab = tab;
                  console.log(tab_url); 
                  // const tab_url = tab.
                  // var card_tabs = hostTabs.filter((tab) => tab.url.includes(`://${hostUrl}/`)).length;
                  // console.log("total: " + card_tabs)
                  return (
                    <li key={index} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <a onClick={async ()=> {
                           await chrome.tabs.update(curr_tab.id, { active: true });
                           await chrome.windows.update(curr_tab.windowId, { focused: true });
                        }}>
                          <h5 className="sub-title card-subtitle tab-text-size">{title}</h5>
                          </a>
                        <button type="button" className="btn-close" aria-label="Close" onClick={(event) => {
                          chrome.tabs.remove(tab.id);
                          // card_tabs -= 1;
                          // console.log(card_tabs);
                          const thisListItem = event.target.parentNode.parentNode;
                          // const thisCardHeader = document.getElementById("main_card_header");
                          // const cardItems = document.getElementsByClassName("list-group-item");
                          // thisCardHeader.classList.add('card_closed');
                          // thisCardHeader.remove();
                          thisListItem.classList.add('closed');
                          thisListItem.remove();
                          // thisListItem.classList.remove('closed');
                        }}></button>
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


const root = createRoot(container);
root.render(<Popup />);