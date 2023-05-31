import React, { useCallback } from "react";
import { truncateText, getHostUrls } from "../helper_functions";


function GetTabListForDG({tabType, currActiveTab, currGroup, currGroupIndex, currGroups, setCurrGroups, currGroupTabs, 
setCurrGroupTabs, currTabs, setCurrTabs, hostUrls, setHostUrls, isGroupCollapsed, setIsGroupCollapsed,
isGroupButtonDisabled, setGroupButtonDisabled, showModalArr, setShowModalArr}) {   
  return (    
        <> {
          tabType.map((tab, index) => {
          const title = tab.title.includes("-") ? tab.title.split("-")[0].trim() : tab.title.includes("–") ? tab.title.split("–")[0].trim() :
          tab.title.includes("|") ? tab.title.split("|")[0].trim() : tab.title;
          const curr_tab = tab;
          const truncatedTitle = truncateText(title, 35);
          return (
            <li key={index} className={'list-group-item ' + (tab.id === currActiveTab.id ? 'active-tab' : '')}>
              <div className="d-flex justify-content-between align-items-center">
                <a onClick={async () => {
                  await chrome.tabs.update(tab.id, { active: true });
                  await chrome.windows.update(tab.windowId, { focused: true });
                }}>
                  <h5 className={(tab.id === currActiveTab.id ? 'active-tab-text' : 'sub-title')}>{truncatedTitle}</h5>
                </a>
                <button type="button" className="btn-close" aria-label="Close" onClick={() =>{
                  chrome.tabs.remove(tab.id);
                  const tabHostUrl = new URL(tab.url).hostname;
                  const hostTabs = currTabs.filter((tab) => tab.url.includes(`://${tabHostUrl}/`));
                  const tabHostUrlIndex = hostUrls.indexOf(tabHostUrl);
                  if (hostTabs.length == 1) {
                    setGroupButtonDisabled(currDisabledState => {
                      const updatedDisabledState = [];
                      var index = 0;
                      for (const disabledState of currDisabledState) {
                        if (index !== tabHostUrlIndex) {
                          updatedDisabledState.push(disabledState);
                        }
                        index++;
                      }
                      return updatedDisabledState;
                    });
                    
                    setShowModalArr(currShowModalState => {
                      const updatedShowModalState = [];
                      var index = 0;
                      for (const showModalState of currShowModalState) {
                        if (index !== tabHostUrlIndex) {
                          updatedShowModalState.push(showModalState);
                        }
                        index++;
                      }
                      return updatedShowModalState;
                    });
                  }
                  const updatedTabs = currTabs.filter((remtab) => remtab.id != tab.id);
                  const updatedHostUrls = getHostUrls(updatedTabs);
                  setHostUrls([...updatedHostUrls]);
                  setCurrTabs([...updatedTabs]);
                  const updatedGroupTabs = [];
                  for (const grouped_arr of currGroupTabs) {
                    const updated_arr = grouped_arr.filter((grouped_tab) => grouped_tab.id != tab.id); 
                    if (updated_arr.length > 0) {
                        updatedGroupTabs.push(updated_arr);
                    }
                  }
                  console.log(updatedGroupTabs);
                  setCurrGroupTabs([...updatedGroupTabs]);
                  console.log(tabType);
                  if (tabType.length == 1) {
                    const updatedGroups = currGroups.filter((group) => group !== currGroup);
                    console.log(updatedGroups);
                    const updatedCollapseStates = isGroupCollapsed.filter((state, i) => i !== currGroupIndex);
                    console.log(updatedCollapseStates);
                    setIsGroupCollapsed(updatedCollapseStates);
                    setCurrGroups(updatedGroups);

                  }
                }}></button>
              </div>
            </li>
          );
        })}
        </>
    );
}

export default GetTabListForDG;