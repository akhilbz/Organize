import React from "react";
import { getHostUrls, truncateText } from "./helper_functions";


function GetTabListForDT({tabType, currGroups, setCurrGroups, currGroupTabs, setCurrGroupTabs, currTabs, setCurrTabs, 
  hostUrls, setHostUrls, isGroupButtonDisabled, setGroupButtonDisabled}) {   

  return (    
      <> {
        tabType.map((tab, index) => {
        const title = tab.title.includes("-") ? tab.title.split("-")[0].trim() : tab.title.includes("–") ? tab.title.split("–")[0].trim() :
        tab.title.includes("|") ? tab.title.split("|")[0].trim() : tab.title;
        const curr_tab = tab;
        
        // Group Name Logic (group indicator):
        var group_name = "";
        if (tab.groupId != -1) {
          for (const group of currGroups) {
            if (group.id == tab.groupId) {
              group_name += group.title;
            }
          }
        }

        return (
          <li key={index} className="list-group-item">
            <div className="d-flex justify-content-between align-items-center">
              <a onClick={async ()=> {
                  await chrome.tabs.update(curr_tab.id, { active: true });
                  await chrome.windows.update(curr_tab.windowId, { focused: true });
              }}>
              <h5 className="sub-title">{truncateText(title, 35)}</h5>
              </a>
              <div className="tab-list-items justify-content-between d-flex">
              <div className="group-indicator-div"><h6 className="group-indicator">{group_name}</h6></div>
              <button type="button" className="btn-close"  aria-label="Close" onClick={(event) => {
                const tab_hosturl = new URL(tab.url).hostname;
      
                chrome.tabs.remove(tab.id);
                  const updatedGroupTabs = [];
                  const updatedTabs = currTabs.filter((remtab) => remtab.id != tab.id);
                  setCurrTabs([...updatedTabs]);

                  var updatedGroupsForTabs = [];
                  for (const grouped_arr of currGroupTabs) {
                    const updated_arr = grouped_arr.filter((grouped_tab) => grouped_tab.id != tab.id);
                    if (updated_arr.length > 0) {
                      updatedGroupTabs.push(updated_arr);
                    }
                  }

                  if (tabType.length == 1) {
                    const updatedHostUrls = hostUrls.filter((url) => url != tab_hosturl);
                    var url_index = 0;
                    var updatedGroupButtonDisabledArr = [];
                    for (const url of hostUrls) {
                      if (url != tab_hosturl) {
                        updatedGroupButtonDisabledArr.push(isGroupButtonDisabled[url_index])
                      }
                      url_index++;
                    }
                    setHostUrls([...updatedHostUrls]);
                    setGroupButtonDisabled(updatedGroupButtonDisabledArr);
                  } else {
                    var isButtonDisabled = [];
                    var url_index = 0;
                    for (const url of hostUrls) {
                      if (tab_hosturl == url) {
                        break;
                      }
                      url_index++;
                    }
                    var isDisabled = false;
                    for (const hostTab of tabType) {
                      if (hostTab != tab) {
                        if (hostTab.groupId !== -1) {
                          isDisabled = true;
                        } else {
                          isDisabled = false;
                          break;
                        }
                      }
                    }
                    var updatedGroupButtonDisabledArr = [];
                    var index = 0;

                    for (const disabledVal of isGroupButtonDisabled) {
                      if (index == url_index) {
                        updatedGroupButtonDisabledArr.push(isDisabled);
                      } else {
                        updatedGroupButtonDisabledArr.push(disabledVal);
                      }
                      index++;
                    }
                    setGroupButtonDisabled([...updatedGroupButtonDisabledArr]);
                  }

                  if (currGroupTabs.length - updatedGroupTabs.length == 1) {
                  const updatedGroups = currGroups.filter((currGroup) => tab.groupId !== currGroup.id);
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