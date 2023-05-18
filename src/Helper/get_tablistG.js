import React from "react";
import { truncateText, getHostUrls } from "./helper_functions";


function GetTabListForDG({tabType, currGroup, currGroups, setCurrGroups, currGroupTabs, 
setCurrGroupTabs, currTabs, setCurrTabs, hostUrls, setHostUrls}) {   
//   console.log(currGroups);
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
                    // console.log("hi!");
                  chrome.tabs.remove(tab.id);
                //   const thisListItem = event.target.parentNode.parentNode;
                //   thisListItem.classList.add('closed');
                //   thisListItem.remove();
                  const updatedTabs = currTabs.filter((remtab) => remtab.id != tab.id);
                  const updatedHostUrls = getHostUrls(updatedTabs);
                //   console.log("updatedTabs");
                //   console.log(updatedTabs);
                  setCurrTabs([...updatedTabs]);
                //   console.log("tabType");
                //   console.log(tabType);

                  const updatedGroupTabs = [];
                  for (const grouped_arr of currGroupTabs) {
                    const updated_arr = grouped_arr.filter((grouped_tab) => grouped_tab.id != tab.id); 
                    if (updated_arr.length > 0) {
                        updatedGroupTabs.push(updated_arr);
                    }
                  }
                //   console.log(updatedGroupTabs);
                  setCurrGroupTabs([...updatedGroupTabs]);
                  if (tabType.length == 1) {
                    // console.log("true");
                    const updatedGroups = currGroups.filter((group) => group !== currGroup);
                    // console.log(updatedGroups);
                    setCurrGroups(updatedGroups);
                  }

                  
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