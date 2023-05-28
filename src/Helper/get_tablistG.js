import React, { useCallback } from "react";
import { truncateText, getHostUrls } from "./helper_functions";


function GetTabListForDG({tabType, currGroup, currGroupIndex, currGroups, setCurrGroups, currGroupTabs, 
setCurrGroupTabs, currTabs, setCurrTabs, hostUrls, setHostUrls, isGroupCollapsed, setIsGroupCollapsed}) {   
  return (    
        <> {
          tabType.map((tab, index) => {
          const title = tab.title.includes("-") ? tab.title.split("-")[0].trim() : tab.title.includes("–") ? tab.title.split("–")[0].trim() :
          tab.title.includes("|") ? tab.title.split("|")[0].trim() : tab.title;
          const curr_tab = tab;
          const truncatedTitle = truncateText(title, 35);
          return (
            <li key={index} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center">
                <a onClick={async () => {
                  await chrome.tabs.update(tab.id, { active: true });
                  await chrome.windows.update(tab.windowId, { focused: true });
                }}>
                  <h5 className="sub-title card-subtitle tab-text-size">{truncatedTitle}</h5>
                </a>
                <button type="button" className="btn-close" aria-label="Close" onClick={() =>{
                    const tab_hosturl = new URL(tab.url).hostname;

                    chrome.tabs.remove(tab.id);
                    const updatedTabs = currTabs.filter((remtab) => remtab.id != tab.id);
                    const updatedHostUrls = getHostUrls(updatedTabs);
  
                    setCurrTabs([...updatedTabs]);
                    const updatedGroupTabs = [];
                    for (const grouped_arr of currGroupTabs) {
                      const updated_arr = grouped_arr.filter((grouped_tab) => grouped_tab.id != tab.id); 
                      if (updated_arr.length > 0) {
                          updatedGroupTabs.push(updated_arr);
                      }
                    }
  
                    setCurrGroupTabs([...updatedGroupTabs]);
                    if (tabType.length == 1) {
                      const updatedGroups = currGroups.filter((group) => group !== currGroup);
                      const updatedCollapseStates = isGroupCollapsed.filter((state, i) => i !== currGroupIndex);
                      setIsGroupCollapsed(updatedCollapseStates);
                      setCurrGroups(updatedGroups);
                    }
                    setHostUrls([...updatedHostUrls]);
  
                }}></button>
              </div>
            </li>
          );
        })}
        </>
    );
}

export default GetTabListForDG;