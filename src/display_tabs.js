import React, { useContext } from "react";
// import { PopupContext } from "./global_context.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { Dropdown } from "react-bootstrap";
import chrome_logo from '/Users/akhileshbitla/Work/products/Organize/src/images/chrome_icon.png';
import extension_logo from '/Users/akhileshbitla/Work/products/Organize/src/images/extension_icon.png';


function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
}

function DisplayTabs({ hostUrls, currTabs, collator}) {
    
        // Logic for seperating tabs by hostUrl
        // console.log(hostUrls);
        return (
          <>
        { hostUrls.map((hostUrl, index) => {
          const hostTabs = currTabs.filter((tab) => tab.url.includes(`://${hostUrl}/`)); // tab refers to the tab of each currTabs
          hostTabs.sort((a, b) => collator.compare(a.title, b.title)); // sorts by title for all hostTabs
          let favIcon_img = hostTabs[0].favIconUrl;
          if (hostTabs[0].url.includes("chrome://newtab/")) { 
            favIcon_img = require('/Users/akhileshbitla/Work/products/Organize/src/images/chrome_icon.png').default;
          } else if (hostTabs[0].url.includes("chrome://extensions/")) {
            favIcon_img = require('/Users/akhileshbitla/Work/products/Organize/src/images/extension_icon.png').default;
        }
  
          // Group Title Logic:
          const tld = hostUrl.split('.');
          console.log("right here...");
          var hostTitle = "";
  
          if (tld.length >= 3) { 
            if (tld[0] == "www") {
              for (let i = 1; i < tld.length - 1; i++) {
                hostTitle += tld[i];
              }
            } else {
              for (let i = 0; i < tld.length - 1; i++) {
                if (i == 1) {
                  hostTitle += ".";
                }
                hostTitle += tld[i];
              }
            }
          } else if (tld.length > 1) {
              for (let i = 0; i < tld.length - 1; i++) {
                hostTitle += tld[i];
              }
          } else {
            hostTitle = tld[0];
          }
  
          const tabIds = hostTabs.map(({ id }) => id);
          const truncatedTitle = truncateText(hostTitle, 15);
          var groupID = 0;
          
          return (
            <div key={index} className="col-md-4 mb-2">
              <div className="card">
                <div className="card-header d-flex justify-content-between">
                  <div className="left-side-items d-flex">
                  <img className="favicon" src={favIcon_img} alt="" />
  
                  <h4 className="title card-title header-text">{hostUrl}</h4>
                  </div>
                  <div className="right-side-items d-flex">
                    <button className="group" onClick= { async () => {     
                      groupID = await chrome.tabs.group({ tabIds });  
                      console.log("tabIds: " + tabIds[0]);
                      await chrome.tabGroups.update( groupID, { title: truncatedTitle });
                      }}>
                      <FontAwesomeIcon icon={faLayerGroup} style={{color: "#000000",}} className="fa-layer-group fa-thin fa-lg" />
                      <span className="tooltip group-label">Group Tabs</span>
                    </button>
  
                    <Dropdown className="card-settings">
                    <Dropdown.Toggle variant="success">
                      <FontAwesomeIcon icon={faEllipsisV} style={{ color: '#000000' }} className="fa-ellipsis-v fa-thin fa-lg" />    
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                    <Dropdown.Item onClick={ async () => {
                      if (groupID != 0) {
                        console.log("here: " + groupID);
                        await chrome.tabs.ungroup(tabIds, ()=>{});
                      }
                    }}>Ungroup</Dropdown.Item>
                    <Dropdown.Item onClick={""}>Close All Tabs</Dropdown.Item>
                    </Dropdown.Menu>
                    <span className="tooltip settings-label">Settings</span>
                    </Dropdown>
                  </div>
                </div>
  
                <ul className="list-group list-group-flush">
                  {
                  hostTabs.map((tab, index) => {
                    const title = tab.title.includes("-") ? tab.title.split("-")[0].trim() : tab.title.includes("–") ? tab.title.split("–")[0].trim() :
                    tab.title.includes("|") ? tab.title.split("|")[0].trim() : tab.title;
                    const tab_url = new URL(tab.url).pathname;
                    const curr_tab = tab;
                    // console.log(tab_url); 
  
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
                            chrome.tabs.remove(tab.id);
                            
                            const thisListItem = event.target.parentNode.parentNode;
                            thisListItem.classList.add('closed');
                            thisListItem.remove();
                          }}></button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })}
        </>
        );
      }

export default DisplayTabs;