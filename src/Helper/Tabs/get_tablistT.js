import React from "react";
import { truncateText, getModdedColor } from "../helper_functions";


function GetTabListForDT({tabType, currActiveTab, currGroups, setCurrGroups, currGroupTabs, setCurrGroupTabs, currTabs, setCurrTabs, 
  hostUrls, setHostUrls, isGroupButtonDisabled, setGroupButtonDisabled, isGroupCollapsed, setIsGroupCollapsed,
  showModalArr, setShowModalArr, showCheckboxesAndBtns, setShowCheckboxesAndBtns}) {   
  return (    
      <> {
        tabType.map((tab, index) => {
        const title = tab.title.includes("-") ? tab.title.split("-")[0].trim() : tab.title.includes("–") ? tab.title.split("–")[0].trim() :
        tab.title.includes("|") ? tab.title.split("|")[0].trim() : tab.title;
        const curr_tab = tab;
        
        // Group Name Logic (group indicator):
        var group_name = "";
        var name_color = null;
        if (tab.groupId != -1) {
          for (const group of currGroups) {
            if (group.id == tab.groupId) {
              name_color = getModdedColor(group.color);
              if (group.title.length > 0) {
              group_name = group.title;
              } else {
                group_name = "no_name";
              }
            }
          }
        }

        return (
          <li key={index} className={'list-group-item ' + (tab.id === currActiveTab.id ? 'active-tab' : '')}>
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex">
              {showCheckboxesAndBtns && (<label className="tab-checkbox"><input type="checkbox"/></label>)}
              <a onClick={async ()=> {
                  await chrome.tabs.update(curr_tab.id, { active: true });
                  await chrome.windows.update(curr_tab.windowId, { focused: true });
              }}>
              <h5 className={(tab.id === currActiveTab.id ? 'active-tab-text' : 'sub-title')}>{truncateText(title, 35)}</h5>
              </a>
              </div>
              <div className="tab-list-items justify-content-between d-flex">
              <div className="group-indicator-div"><h6 className="group-indicator">{group_name}</h6></div>
              <button type="button" className="btn-close"  aria-label="Close" onClick={(event) => {
                chrome.tabs.remove(tab.id);
                const updatedTabs = currTabs.filter((remtab) => remtab.id != tab.id);
                setCurrTabs([...updatedTabs]);
                
                const tabHostUrl = new URL(tab.url).hostname;
                const tabHostUrlIndex = hostUrls.indexOf(tabHostUrl);
                if (tabType.length == 1) {
                  setHostUrls(currHostUrls => {
                    const updatedHostUrls = currHostUrls.filter((url) => url != tabHostUrl);
                    return updatedHostUrls;
                  });
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
                } else {
                  const isDisabled = tabType.some((hostTab) => hostTab.id !== tab.id && hostTab.groupId !== -1);
                  setGroupButtonDisabled(currDisabledState => {
                    var updatedDisabledState = [];
                    var index = 0;
                    for (const disabledState of currDisabledState) {
                      if (index == tabHostUrlIndex) {
                        updatedDisabledState.push(isDisabled);
                      } else {
                        updatedDisabledState.push(disabledState);
                      }
                      index++;
                    }
                    return updatedDisabledState;
                  });

                  setShowModalArr(currShowModalState => {
                    const updatedShowModalState = [...currShowModalState];
                    var notAllGrouped = false;
                    var nonGrouped = 0;
                    for (const tab of tabType) {
                      if (tab.groupId === -1) {
                        nonGrouped++;
                      }
                    }
                
                    if (nonGrouped != 0 && nonGrouped < tabType.length) {
                      notAllGrouped = true;
                    } 
                    updatedShowModalState[tabHostUrlIndex] = notAllGrouped;
                    return updatedShowModalState;
                  });
                }

                const updatedGroupTabs = [];
                for (const grouped_arr of currGroupTabs) {
                  const updated_arr = grouped_arr.filter((grouped_tab) => grouped_tab.id != tab.id);
                  if (updated_arr.length > 0) {
                    updatedGroupTabs.push(updated_arr);
                  }
                }

                if (currGroupTabs.length - 1 == updatedGroupTabs.length) {
                var updatedGroups = [];
                var updatedCollapsedStates = [];
                var collapsedStateIndex = 0;
                for (const group of currGroups) {
                  if (group.id !== tab.groupId) {
                    updatedGroups.push(group);
                    updatedCollapsedStates.push(isGroupCollapsed[collapsedStateIndex]);
                  }
                  collapsedStateIndex++;
                }
                setIsGroupCollapsed(updatedCollapsedStates);
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