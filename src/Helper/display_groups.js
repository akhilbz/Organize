import React, { useState } from "react";
import GetTabListForDG from "./get_tablistG";
import { Collapse, Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { getHostUrls } from "./helper_functions";

function DisplayGroups({currGroups, setCurrGroups, currGroupTabs, setCurrGroupTabs,
     currTabs, setCurrTabs, hostUrls, setHostUrls, isGroupButtonDisabled, setGroupButtonDisabled}) {
    const [showGroupLists, setShowGroupLists] = useState([]);
    
    return (
        <> {
        currGroups.map((currGroup, index) => {
            // console.log("currGroupTabs");
            // console.log(currGroupTabs);
            const groupTabs = currGroupTabs.filter((grpTab) => grpTab[0].groupId == currGroup.id);
            // console.log(groupTabs);
            showGroupLists.push(!currGroup.collapsed);
            const tabIds = groupTabs[0].map(({ id }) => id);

            // console.log(tabIds);
            return (
            <div key={index} className="col-md-4 mb-2 ">
            
              <div className="card .card-group">
                <div onClick={ async () => {
                    const allUpdatedGLists = [...showGroupLists];
                    allUpdatedGLists[index] =  !showGroupLists[index];
                    await chrome.tabGroups.update(currGroup.id, { collapsed: !allUpdatedGLists[index] });
                    setShowGroupLists(allUpdatedGLists);
                    }} 
                    className="collapse-feature card-header d-flex justify-content-between" aria-expanded={showGroupLists[index]} aria-controls="collapseGroup${index}">
                  <div className="left-side-items d-flex">
                    <h4 className="title card-title header-text">{currGroup.title}</h4>
                  </div>
                  <div className="group-right-side-items d-flex">  
                    <Dropdown className="card-settings" onClick={async (e) => {e.stopPropagation();}}>
                    <Dropdown.Toggle variant="success">
                      <FontAwesomeIcon icon={faEllipsisV} style={{ color: '#000000' }} className="fa-ellipsis-v fa-thin fa-lg" />    
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                    <Dropdown.Item onClick={ async () => {

                        const updatedGroupTabs = currGroupTabs.filter((gTabs) => gTabs[0].groupId != groupTabs[0][0].groupId);
                        await chrome.tabs.ungroup(tabIds, ()=>{});
                        const updatedGroups = currGroups.filter((group) => group !== currGroup);
                        setCurrGroupTabs(updatedGroupTabs);
                        setCurrGroups(updatedGroups);    
                        
                        const groupTabsUrls = [...getHostUrls(groupTabs[0])];
                        const hostUrlIndexes = groupTabsUrls.map((groupTabsUrl) => hostUrls.indexOf(groupTabsUrl)).filter((index) => index !== -1);                        
                        
                        setGroupButtonDisabled((currDisabledState) => {
                            const updatedGroupButtonDisabled = [...currDisabledState];
                            hostUrlIndexes.forEach((index) => updatedGroupButtonDisabled[index] = false);
                            // updatedGroupButtonDisabled[index] = false;
                            return updatedGroupButtonDisabled;
                          });

                    }}>Ungroup</Dropdown.Item>
                    <Dropdown.Item onClick={""}>Close Group</Dropdown.Item>
                    </Dropdown.Menu>
                    <span className="tooltip settings-label">Settings</span>
                    </Dropdown>
                  </div>
                </div>
                <Collapse in={showGroupLists[index]}>
                <div className="" id={'collapseGroup${index}'}>              
                <ul className="list-group list-group-flush">
                    <GetTabListForDG tabType={groupTabs[0]} currGroup={currGroup} currGroups={currGroups} setCurrGroups={setCurrGroups} 
                    currGroupTabs={currGroupTabs} setCurrGroupTabs={setCurrGroupTabs} currTabs={currTabs} setCurrTabs={setCurrTabs} 
                    hostUrls={hostUrls} setHostUrls={setHostUrls} isGroupButtonDisabled={isGroupButtonDisabled} setGroupButtonDisabled={setGroupButtonDisabled} />
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