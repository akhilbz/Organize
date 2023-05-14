import React from "react";
import { truncateText } from "./helper_functions";


function GetTabList({hostTabs}) {
    
    return (
        <> {
        hostTabs.map((tab, index) => {
          const title = tab.title.includes("-") ? tab.title.split("-")[0].trim() : tab.title.includes("–") ? tab.title.split("–")[0].trim() :
          tab.title.includes("|") ? tab.title.split("|")[0].trim() : tab.title;
          const tab_url = new URL(tab.url).pathname;
          const curr_tab = tab;
          // console.log(tab_url); 

          return (
            <li key={index} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center">
                <a onClick={async ()=> {
                   await chrome.tabs.update(curr_tab.id, { active: true });
                   await chrome.windows.update(curr_tab.windowId, { focused: true });
                }}>
                  <h5 className="sub-title card-subtitle tab-text-size">{truncateText(title, 35)}</h5>
                  </a>
                <button type="button" className="btn-close" aria-label="Close" onClick={(event) => {
                  chrome.tabs.remove(tab.id);
                  
                  const thisListItem = event.target.parentNode.parentNode;
                  thisListItem.classList.add('closed');
                  thisListItem.remove();
                }}></button>
              </div>
            </li>
          );
        })}
        </>
    );
}

export default GetTabList;