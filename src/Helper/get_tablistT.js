import React from "react";
import { getHostUrls, truncateText } from "./helper_functions";


function GetTabListForDT({tabType, currGroups, setCurrGroups, currGroupTabs, setCurrGroupTabs, currTabs, setCurrTabs, hostUrls, setHostUrls}) {   
  console.log("now");
  console.log(currGroupTabs);
  console.log(currGroups);
  return (    
        <> {
          tabType.map((tab, index) => {
          const title = tab.title.includes("-") ? tab.title.split("-")[0].trim() : tab.title.includes("–") ? tab.title.split("–")[0].trim() :
          tab.title.includes("|") ? tab.title.split("|")[0].trim() : tab.title;
          const tab_hosturl = new URL(tab.url).hostname;
          // console.log(tab_hosturl);
          const curr_tab = tab;
          // console.log(tab_url); 
          // console.log(currGroupTabs);  
          var group_name = "";
          if (tab.groupId != -1) {
            for (const group of currGroups) {
              if (group.id == tab.groupId) {
                group_name += group.title;
              }
            }
          }
          console.log(group_name);
          return (
            <li key={index} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center">
                <a onClick={async ()=> {
                   await chrome.tabs.update(curr_tab.id, { active: true });
                   await chrome.windows.update(curr_tab.windowId, { focused: true });
                }}>
                  <h5 className="sub-title card-subtitle tab-text-size">{truncateText(title, 35)}</h5>
                  </a>
                  <div className="tab-list-items d-flex">
                  <h6 className="group-indicator">{group_name}</h6>
                <button type="button" className="btn-close" aria-label="Close" onClick={(event) => {
                  console.log("tab"); 
                  console.log(tab); 
                  console.log(curr_tab); 
                  // const currGroupId = tab.groupId;
                  // console.log(tabType.length);
                  chrome.tabs.remove(tab.id);
                   const updatedGroupTabs = [];
                   const updatedTabs = currTabs.filter((remtab) => remtab.id != tab.id);
                  // console.log("hello!");
                  // console.log(updatedTabs);
                   setCurrTabs([...updatedTabs]);
                   var updatedGroupsForTabs = [];
                  for (const grouped_arr of currGroupTabs) {
                    
                    const updated_arr = grouped_arr.filter((grouped_tab) => grouped_tab.id != tab.id);
                    // console.log("updated_arr");
                    // console.log(updated_arr);
                    if (updated_arr.length > 0) {
                      updatedGroupTabs.push(updated_arr);
                    }
                  }
                  
                  if (tabType.length == 1) {
                    const updatedHostUrls = hostUrls.filter((url) => url != tab_hosturl);
                    // console.log(updatedHostUrls);
                    setHostUrls([...updatedHostUrls]);
                  }
                  // const thisListItem = event.target.parentNode.parentNode;
                  // thisListItem.classList.add('closed');
                  // thisListItem.remove();
                  // console.log("currGroupTabs");
                  // console.log(currGroupTabs);
                  // console.log("updatedGroupTabs");
                  // console.log(updatedGroupTabs);

                  if (currGroupTabs.length - updatedGroupTabs.length == 1) {
                    console.log("here");
                   
                    // console.log("currGroups");
                    // console.log(currGroups);
                    const updatedGroups = currGroups.filter((currGroup) => tab.groupId !== currGroup.id);
                    // console.log("updatedGroups");
                    // console.log(updatedGroups);
                    setCurrGroups(updatedGroups);
                  }

                  setCurrGroupTabs([...updatedGroupTabs]);
                  
                  
                }}></button>
                </div>
              </div>
            </li>
          );
        })}
        </>
    );
}

export default GetTabListForDT;