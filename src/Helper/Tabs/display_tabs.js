import React, { useState } from "react";
import GetTabListForDT from "./get_tablistT";
import GroupOnlySome from "./Group_Modal/group_modal";
import { GroupAllTabs } from "./group_no_modal";
import { truncateText, groupTitle, getHostUrls } from "../helper_functions";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { Dropdown } from "react-bootstrap";
import chrome_logo from '/Users/akhileshbitla/Work/products/Organize/src/images/chrome_icon.png';
import extension_logo from '/Users/akhileshbitla/Work/products/Organize/src/images/extension_icon.png';


function DisplayTabs({ currActiveTab, currGroups, setCurrGroups, currGroupTabs, setCurrGroupTabs,
hostUrls, setHostUrls, currTabs, setCurrTabs, isGroupButtonDisabled, setGroupButtonDisabled, 
showModal, setShowModal, showModalArr, setShowModalArr, currHostUrlIndex, setCurrHostUrlIndex,
isGroupCollapsed, setIsGroupCollapsed, collator}) {
  const [currHostTabs, setCurrHostTabs] = useState([]);
  const [currHostUrl, setCurrHostUrl] = useState("");

  return (
  <> { 
  hostUrls.map((hostUrl, index) => {
    const hostTabs = currTabs.filter((tab) => tab.url.includes(`://${hostUrl}/`)); // tab refers to the tab of each currTabs
    hostTabs.sort((a, b) => collator.compare(a.title, b.title)); // sorts by title for all hostTabs
    // TODO: clean this code:
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
  const truncatedTitle = truncateText(hostTitle, 25);
  return (
    <div key={index} className="col-md-4 mb-2">
      <div className="card card-tabs">
        <div className="card-header tab-header d-flex justify-content-between">
          <div className="left-side-items d-flex">
          <img className="favicon" src={favIcon_img} alt="" />

          <h4 className="header-text">{truncatedTitle}</h4>
          </div>
          <div className="right-side-items d-flex">
            <button className="group" disabled={isGroupButtonDisabled[index]} onClick= { () => {
              if (showModalArr[index]) { setShowModal(true); setCurrHostUrlIndex(index); setCurrHostTabs(hostTabs); setCurrHostUrl(hostUrl); }
              else { GroupAllTabs({tabIds, index, truncatedTitle, setGroupButtonDisabled, currTabs, setCurrTabs, currGroupTabs, 
              setCurrGroupTabs, currGroups, setCurrGroups, isGroupCollapsed, setIsGroupCollapsed});} }}>
              <FontAwesomeIcon icon={faLayerGroup} className="fa-layer-group fa-thin fa-lg ${isGroupButtonDisabled[index] ? 'disabled' : 'enabled'}" />
              <span className="tooltip group-label">{isGroupButtonDisabled[index] ? 'All Grouped' : 'Quick Group'}</span>
            </button>
            
            {showModalArr[index] && (<GroupOnlySome currHostUrlIndex={currHostUrlIndex} showModal={showModal} setShowModal={setShowModal} 
            currHostTabs={currHostTabs} setCurrHostTabs={setCurrHostTabs} hostTabs={hostTabs} currHostUrl={currHostUrl} hostUrls={hostUrls} currGroups={currGroups} 
            setCurrGroups={setCurrGroups} currGroupTabs={currGroupTabs} setCurrGroupTabs={setCurrGroupTabs} isGroupButtonDisabled={isGroupButtonDisabled} 
            setGroupButtonDisabled={setGroupButtonDisabled} currTabs={currTabs} setCurrTabs={setCurrTabs} isGroupCollapsed={isGroupCollapsed} 
            setIsGroupCollapsed={setIsGroupCollapsed} showModalArr={showModalArr} setShowModalArr={setShowModalArr} />)}

            <Dropdown className="card-settings">
            <Dropdown.Toggle variant="success">
              <FontAwesomeIcon icon={faEllipsisV} style={{ color: '#000000' }} className="fa-ellipsis-v fa-thin fa-lg" />    
            </Dropdown.Toggle>
            <Dropdown.Menu>
            <Dropdown.Item onClick={async ()=> {
              await chrome.tabs.remove(tabIds, ()=>{});
              // updating tabs and corresponding host urls for tabs section
              const updatedTabs = currTabs.filter((tab) => !hostTabs.includes(tab));
              setCurrTabs([...updatedTabs]);
              const updatedHostUrls = getHostUrls(updatedTabs);
              setHostUrls([...updatedHostUrls]);
              setGroupButtonDisabled(currDisabledState => {
                const updatedDisabledState = currDisabledState.filter((disabledState, stateIndex) => stateIndex !== index);
                return updatedDisabledState;
              });
              setShowModalArr(currShowModalState => {
                const updatedShowModalState = currShowModalState.filter((showModalState, stateIndex) => stateIndex !== index);
                return updatedShowModalState;
              });

              var updatedCurrGroupTabs = []; 
              for (const groupTabs of currGroupTabs) {
                const updatedTabs = groupTabs.filter((tab) => !tabIds.includes(tab.id));
                if (updatedTabs.length > 0) {
                updatedCurrGroupTabs.push(updatedTabs);
                }
              }
              console.log(updatedCurrGroupTabs);
              console.log(isGroupCollapsed);

              // updating current groups
              const groupIds = updatedCurrGroupTabs.map((updatedGroupTabs) => updatedGroupTabs[0].groupId);
              const updatedGroups = currGroups.filter(({ id }) => groupIds.includes(id));
              const updatedCollapsedStates = updatedGroups.map((group) => group.collapsed);
              setCurrGroupTabs([...updatedCurrGroupTabs]);
              setCurrGroups(updatedGroups);
              setIsGroupCollapsed(updatedCollapsedStates);
            }}>Close All Tabs</Dropdown.Item>
            </Dropdown.Menu>
            <span className="tooltip settings-label">Settings</span>
            </Dropdown>
          </div>
        </div>
        <ul className="list-group list-group-flush">
          <GetTabListForDT tabType={hostTabs} currActiveTab={currActiveTab} currGroups={currGroups} setCurrGroups={setCurrGroups} currGroupTabs={currGroupTabs}
          setCurrGroupTabs={setCurrGroupTabs} currTabs={currTabs} setCurrTabs={setCurrTabs} hostUrls={hostUrls} setHostUrls={setHostUrls}
          isGroupButtonDisabled={isGroupButtonDisabled} setGroupButtonDisabled={setGroupButtonDisabled} isGroupCollapsed={isGroupCollapsed} 
          setIsGroupCollapsed={setIsGroupCollapsed} showModalArr={showModalArr} setShowModalArr={setShowModalArr}/>
        </ul>
      </div>
    </div>
  );
  })}
  </>
  );
}

export default DisplayTabs;