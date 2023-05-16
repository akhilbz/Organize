import React, { useContext } from "react";
import GetTabList from "./get_tablist";
import { truncateText, groupTitle } from "./helper_functions";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { Dropdown } from "react-bootstrap";
import chrome_logo from '/Users/akhileshbitla/Work/products/Organize/src/images/chrome_icon.png';
import extension_logo from '/Users/akhileshbitla/Work/products/Organize/src/images/extension_icon.png';


function DisplayTabs({ currGroups, setCurrGroups, currGroupTabs, setCurrGroupTabs, hostUrls, currTabs, collator}) {
    
        // Logic for seperating tabs by hostUrl
        // console.log(hostUrls);
        return (
        <> { 
        hostUrls.map((hostUrl, index) => {
          const hostTabs = currTabs.filter((tab) => tab.url.includes(`://${hostUrl}/`)); // tab refers to the tab of each currTabs
          hostTabs.sort((a, b) => collator.compare(a.title, b.title)); // sorts by title for all hostTabs
          let favIcon_img = hostTabs[0].favIconUrl;
          if (hostTabs[0].url.includes("chrome://newtab/")) { 
            favIcon_img = require('/Users/akhileshbitla/Work/products/Organize/src/images/chrome_icon.png').default;
          } else if (hostTabs[0].url.includes("chrome://extensions/")) {
            favIcon_img = require('/Users/akhileshbitla/Work/products/Organize/src/images/extension_icon.png').default;
        }
  
          // Group Title Logic:
          var hostTitle = groupTitle(hostUrl);
          const tabIds = hostTabs.map(({ id }) => id);
          const truncatedTitle = truncateText(hostTitle, 15);
          var groupID = 0;
          return (
            <div key={index} className="col-md-4 mb-2">
              <div className="card card-tabs">
                <div className="card-header d-flex justify-content-between">
                  <div className="left-side-items d-flex">
                  <img className="favicon" src={favIcon_img} alt="" />
  
                  <h4 className="title card-title header-text">{hostUrl}</h4>
                  </div>
                  <div className="right-side-items d-flex">
                    <button className="group" onClick= { async () => {      

                      groupID = await chrome.tabs.group({ tabIds });  
                      
                      console.log(group);
                      const tabs_in_group = await chrome.tabs.query({groupId: groupID});
                      var tabs_are_included = false;      
                      await chrome.tabGroups.update( groupID, { collapsed: true, title: truncatedTitle });
                      const group = await chrome.tabGroups.get(groupID);
                      for (const tab of tabs_in_group) {
                        tabs_are_included = JSON.stringify(currGroupTabs).includes(tab.url);
                      }

                      if (!tabs_are_included) {
                        // currGroupTabs.push(tabs_in_group);
                        setCurrGroupTabs(currGroupTabs => [...currGroupTabs, [...tabs_in_group]]);
                        setCurrGroups(currGroups => [...currGroups, group]);
                      }
                     
                     
                      // console.log(currGroupTabs);
                      // console.log(JSON.stringify(currGroupTabs).includes(JSON.stringify(tabs_in_group)));
                      // setCurrGroups([...currGroups]);
                      }}>
                      <FontAwesomeIcon icon={faLayerGroup} style={{color: "#000000",}} className="fa-layer-group fa-thin fa-lg" />
                      <span className="tooltip group-label">Group Tabs</span>
                    </button>
  
                    <Dropdown className="card-settings">
                    <Dropdown.Toggle variant="success">
                      <FontAwesomeIcon icon={faEllipsisV} style={{ color: '#000000' }} className="fa-ellipsis-v fa-thin fa-lg" />    
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                    {/* <Dropdown.Item onClick={ async () => {
                      if (groupID != 0) {
                        // console.log("here: " + groupID);
                        await chrome.tabs.ungroup(tabIds, ()=>{});
                      }
                    }}>Ungroup</Dropdown.Item> */}
                    <Dropdown.Item onClick={""}>Close All Tabs</Dropdown.Item>
                    </Dropdown.Menu>
                    <span className="tooltip settings-label">Settings</span>
                    </Dropdown>
                  </div>
                </div>
                <ul className="list-group list-group-flush">
                  <GetTabList tabType={hostTabs} />
                </ul>
              </div>
            </div>
          );
        })}
        </>
        );
      }

export default DisplayTabs;