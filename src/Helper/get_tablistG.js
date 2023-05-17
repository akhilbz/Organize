import React from "react";
import { truncateText, getHostUrls } from "./helper_functions";


function GetTabListForDG({tabType, currGroup, currGroups, setCurrGroups, currGroupTabs, setCurrGroupTabs, currTabs, setCurrTabs, hostUrls, setHostUrls}) {   
  
  return (    
        <> {
          tabType.map((tab, index) => {
          const title = tab.title.includes("-") ? tab.title.split("-")[0].trim() : tab.title.includes("–") ? tab.title.split("–")[0].trim() :
          tab.title.includes("|") ? tab.title.split("|")[0].trim() : tab.title;
          const tab_url = new URL(tab.url).pathname;
          const curr_tab = tab;
          // console.log(tab_url); 
        //   console.log(currGroupTabs);  
          // console.log(tab);  
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
                    console.log("hi!");
                  chrome.tabs.remove(tab.id);
                  const thisListItem = event.target.parentNode.parentNode;
                  thisListItem.classList.add('closed');
                  thisListItem.remove();
                  const updatedTabs = currTabs.filter((remtab) => remtab.id != tab.id);
                  const updatedHostUrls = getHostUrls(updatedTabs);

                  if (tabType.length == 1) {
                    const updatedGroups = currGroups.filter((group) => group != currGroup);
                    console.log(updatedGroups);
                    setCurrGroups([...updatedGroups]);
                  }

                  console.log(updatedTabs);
                  setCurrTabs([...updatedTabs]);
                  setHostUrls([...updatedHostUrls]);
                //   setCurrGroups(updatedGroups);
                }}></button>
              </div>
            </li>
          );
        })}
        </>
    );
}

export default GetTabListForDG;