import React from "react";
import { Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup, faEllipsisV } from '@fortawesome/free-solid-svg-icons';


function DisplayGroups({currGroups, currGroupTabs}) {
    // console.log("cG: " + currGroups);
    // console.log("cGT: " + currGroupTabs);
    
    return (
        <> {
        currGroups.map((currGroup, index) => {
            const groupTabs = currGroupTabs.filter((grpTab) => grpTab[0].groupId == currGroup.id);
            console.log(groupTabs);
            
            return (
            <div key={index} className="col-md-4 mb-2 ">
            
              <div className="card .card-group">
                <div className="card-header d-flex justify-content-between">
                  <div className="left-side-items d-flex">
                  {/* <svg>
                    <circle cx={radius} cy={radius} r={radius} fill={color} />
                 </svg> */}

                  <h4 className="title card-title header-text">{currGroup.title}</h4>
                  </div>
                  <div className="right-side-items d-flex">
                    {/* <button className="group" onClick= { async () => {     
                      groupID = await chrome.tabs.group({ tabIds });  
                      console.log("tabIds: " + tabIds[0]);
                      await chrome.tabGroups.update( groupID, { title: truncatedTitle });
                      }}>
                      <FontAwesomeIcon icon={faLayerGroup} style={{color: "#000000",}} className="fa-layer-group fa-thin fa-lg" />
                      <span className="tooltip group-label">Group Tabs</span>
                    </button> */}
  
                    <Dropdown className="card-settings">
                    <Dropdown.Toggle variant="success">
                      <FontAwesomeIcon icon={faEllipsisV} style={{ color: '#000000' }} className="fa-ellipsis-v fa-thin fa-lg" />    
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                    <Dropdown.Item onClick={ async () => {
                    //   if (groupID != 0) {
                    //     console.log("here: " + groupID);
                    //     await chrome.tabs.ungroup(tabIds, ()=>{});
                    //   }
                    }}>Ungroup</Dropdown.Item>
                    <Dropdown.Item onClick={""}>Close All Tabs</Dropdown.Item>
                    </Dropdown.Menu>
                    <span className="tooltip settings-label">Settings</span>
                    </Dropdown>
                  </div>
                </div>
  
                <ul className="list-group list-group-flush">
                  {/* <GetTabList hostTabs={hostTabs} /> */}
                </ul>
              </div>
            </div>
            );
        })} 
        </>
    );
}

export default DisplayGroups;