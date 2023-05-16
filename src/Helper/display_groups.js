import React, { useState} from "react";
import GetTabList from "./get_tablist";
import { Collapse, Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup, faEllipsisV } from '@fortawesome/free-solid-svg-icons';


function DisplayGroups({currGroups, currGroupTabs}) {
    const [showGroupLists, setShowGroupLists] = useState([]);
    
    // const [allIndexes, setAllIndexes] = useState([]);
    // const toggleCollapse = (index) => {
    //     const updatedGListStates = [...showGroupList];
    //     updatedGListStates[index] = !updatedGListStates[index];
    //     setOpenStates(updatedGListStates);
    //   };
    // console.log("cG: " + currGroups);
    // console.log("cGT: " + currGroupTabs);
    
    return (
        <> {
        currGroups.map((currGroup, index) => {
            console.log(currGroup);
            const groupTabs = currGroupTabs.filter((grpTab) => grpTab[0].groupId == currGroup.id);
            showGroupLists.push(!currGroup.collapsed);
            
            return (
            <div key={index} className="col-md-4 mb-2 ">
            
              <div className="card .card-group">
                <div onClick={ async () => {
                    
                    const allUpdatedGLists = [...showGroupLists];
                    allUpdatedGLists[index] =  !showGroupLists[index];
                    await chrome.tabGroups.update(currGroup.id, { collapsed: !allUpdatedGLists[index] });
                    console.log(allUpdatedGLists);
                    setShowGroupLists(allUpdatedGLists);
                    
                    }} 
                    className="collapse-feature card-header d-flex justify-content-between" aria-expanded={showGroupLists[index]} aria-controls="collapseGroup${index}">
                  <div className="left-side-items d-flex">
                    <h4 className="title card-title header-text">{currGroup.title}</h4>
                  </div>
                  <div className="group-right-side-items d-flex">
                    {/* <button className="group" onClick= { async () => {     
                      groupID = await chrome.tabs.group({ tabIds });  
                      console.log("tabIds: " + tabIds[0]);
                      await chrome.tabGroups.update( groupID, { title: truncatedTitle });
                      }}>
                      <FontAwesomeIcon icon={faLayerGroup} style={{color: "#000000",}} className="fa-layer-group fa-thin fa-lg" />
                      <span className="tooltip group-label">Group Tabs</span>
                    </button> */}
  
                    <Dropdown className="card-settings" onClick={(e) => e.stopPropagation()}>
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
                    <Dropdown.Item onClick={""}>Edit</Dropdown.Item>
                    <Dropdown.Item onClick={""}>Close All Tabs</Dropdown.Item>
                    </Dropdown.Menu>
                    <span className="tooltip settings-label">Settings</span>
                    </Dropdown>
                  </div>
                </div>
                <Collapse in={showGroupLists[index]}>
                <div className="" id={'collapseGroup${index}'}>              
                <ul className="list-group list-group-flush">
                    <GetTabList tabType={groupTabs[0]} />
                </ul>
                </div>
              </Collapse>
              </div>
            </div>
            );
        })} 
        </>
    );
}

export default DisplayGroups;