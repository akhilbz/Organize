import React from "react";
import GetTabListForDT from "./get_tablistT";
import { truncateText, groupTitle, getHostUrls } from "./helper_functions";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { Dropdown } from "react-bootstrap";
import chrome_logo from '/Users/akhileshbitla/Work/products/Organize/src/images/chrome_icon.png';
import extension_logo from '/Users/akhileshbitla/Work/products/Organize/src/images/extension_icon.png';


function DisplayTabs({ currGroups, setCurrGroups, currGroupTabs, setCurrGroupTabs,
hostUrls, setHostUrls, currTabs, setCurrTabs, collator}) {
        console.log("displayT");
        console.log(currGroups);
        console.log(currGroupTabs);
        // Logic for seperating tabs by hostUrl
        // console.log(hostUrls);
        return (
        <> { 
        hostUrls.map((hostUrl, index) => {
          const hostTabs = currTabs.filter((tab) => tab.url.includes(`://${hostUrl}/`)); // tab refers to the tab of each currTabs
          console.log("hostTabs");
          console.log(hostTabs);
          hostTabs.sort((a, b) => collator.compare(a.title, b.title)); // sorts by title for all hostTabs

          // clean this code:
          let favIcon_img = hostTabs[0].favIconUrl;
          if (hostTabs[0].url.includes("chrome://newtab/")) { 
            favIcon_img = require('/Users/akhileshbitla/Work/products/Organize/src/images/chrome_icon.png').default;
          } else if (hostTabs[0].url.includes("chrome://extensions/")) {
            favIcon_img = require('/Users/akhileshbitla/Work/products/Organize/src/images/extension_icon.png').default;
        } else if (hostTabs[0].url.includes("chrome://history/")) {
          favIcon_img = require('/Users/akhileshbitla/Work/products/Organize/src/images/history_icon.png').default;
        } else if (hostTabs[0].url.includes("chrome://settings/")) {
          favIcon_img = require('/Users/akhileshbitla/Work/products/Organize/src/images/settings-icon.png').default;
        }
        
          // Group Title Logic:
          var hostTitle = groupTitle(hostUrl);
          const tabIds = hostTabs.map(({ id }) => id);
          const truncatedTitle = truncateText(hostTitle, 24);
          var groupID = 0;
          return (
            <div key={index} className="col-md-4 mb-2">
              <div className="card card-tabs">
                <div className="card-header d-flex justify-content-between">
                  <div className="left-side-items d-flex">
                  <img className="favicon" src={favIcon_img} alt="" />
  
                  <h4 className="title card-title header-text">{truncatedTitle}</h4>
                  </div>
                  <div className="right-side-items d-flex">
                    <button className="group" onClick= { async () => {      

                      groupID = await chrome.tabs.group({ tabIds });  
                      const tabs_in_group = await chrome.tabs.query({groupId: groupID});
                      var tabs_are_included = false;      

                      await chrome.tabGroups.update( groupID, { collapsed: true, title: truncatedTitle });
                      const group = await chrome.tabGroups.get(groupID);
                      console.log("tabs_in_group");
                      console.log(tabs_in_group);
                      console.log(currTabs);
                      var updatedTabs = currTabs.filter((currTab) => currTab.url != tabs_in_group[0].url ); // assuming these tabs' groupId is -1
                      // We can do this because the Quick Group feature only groups the tabs of their respective hostUrls
                      
                      for (const tab of tabs_in_group) {
                        tabs_are_included = JSON.stringify(currGroupTabs).includes(tab.url);
                        const is_tab_included = JSON.stringify(currTabs).includes(tab.id);
                        if (is_tab_included) {
                          console.log("working");
                          updatedTabs.push(tab);
                        }
                        console.log("post");
                        console.log(updatedTabs);
                      }
                      // console.log("out");
                      // console.log(tabs_are_included);
                      // console.log(currGroupTabs);
                      // console.log("cGrps");
                      // console.log(currGroups);
                      // Redo this logic
                      if (!tabs_are_included) {
                        setCurrGroupTabs(currGroupTabs => [...currGroupTabs, [...tabs_in_group]]); // remember to rework the currGroupTabs
                        setCurrGroups(currGroups => [...currGroups, group]);
                      }
                      setCurrTabs([...updatedTabs]);

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
                    <Dropdown.Item onClick={async ()=> {

                      const updatedTabs = currTabs.filter((tab) => !hostTabs.includes(tab));
                      const updatedHostUrls = getHostUrls(updatedTabs);
                      // console.log(updatedTabs);
                      setCurrTabs([...updatedTabs]);
                      setHostUrls([...updatedHostUrls]);
                      // setCurrGroups
                      // setCurrGroupTabs
                      await chrome.tabs.remove(tabIds, ()=>{});
                      
                    }}>Close All Tabs</Dropdown.Item>
                    </Dropdown.Menu>
                    <span className="tooltip settings-label">Settings</span>
                    </Dropdown>
                  </div>
                </div>
                <ul className="list-group list-group-flush">
                  <GetTabListForDT tabType={hostTabs} currGroups={currGroups} setCurrGroups={setCurrGroups} currGroupTabs={currGroupTabs} setCurrGroupTabs={setCurrGroupTabs} 
                  currTabs={currTabs} setCurrTabs={setCurrTabs} hostUrls={hostUrls} setHostUrls={setHostUrls}/>
                </ul>
              </div>
            </div>
          );
        })}
        </>
        );
      }

export default DisplayTabs;