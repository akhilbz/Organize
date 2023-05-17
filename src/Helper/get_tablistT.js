import React from "react";
import { getHostUrls, truncateText } from "./helper_functions";


function GetTabListForDT({tabType, currGroupTabs, setCurrGroupTabs, currTabs, setCurrTabs}) {   
  
  return (    
        <> {
          tabType.map((tab, index) => {
          const title = tab.title.includes("-") ? tab.title.split("-")[0].trim() : tab.title.includes("–") ? tab.title.split("–")[0].trim() :
          tab.title.includes("|") ? tab.title.split("|")[0].trim() : tab.title;
          const tab_url = new URL(tab.url).pathname;
          const curr_tab = tab;
          // console.log(tab_url); 
          console.log(currGroupTabs);  
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
                  console.log("hello!");
                  chrome.tabs.remove(tab.id);
                   const updatedGroupTabs = [];
                  //  currGroupTabs.filter((grouped_arr) => {
                  //   grouped_arr = grouped_arr.filter((grouped_tab) => grouped_tab.id != tab.id);
                  //   console.log(grouped_arr);
                  // });
                  for (const grouped_arr of currGroupTabs) {
                    const updated_arr = grouped_arr.filter((grouped_tab) => grouped_tab.id != tab.id);
                    
                    updatedGroupTabs.push(updated_arr);
                  }
                  console.log(updatedGroupTabs);
                  const thisListItem = event.target.parentNode.parentNode;
                  thisListItem.classList.add('closed');
                  thisListItem.remove();
                  
                  setCurrGroupTabs([...updatedGroupTabs]);
                  setHostUrls([...updatedHostUrls]);
                }}></button>
              </div>
            </li>
          );
        })}
        </>
    );
}

export default GetTabListForDT;