import React, { useState, useRef, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrGroups,  setCurrGroupTabs, setCurrTabs, setHostUrls, setIsGroupCollapsed, setGroupButtonDisabled,
  setShowModalArr, setShowModal, setCurrHostUrlIndex } from "../../actions";
import GetTabListForDT from "./get_tablistT";
import GroupOnlySome from "./Group_Modal/group_modal";
import { GroupAllTabs } from "./group_no_modal";
import { truncateText, groupTitle, getHostUrls } from "../helper_functions";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { Dropdown } from "react-bootstrap";
import chrome_logo from '/Users/akhileshbitla/Work/products/Organize/src/images/chrome_icon.png';
import extension_logo from '/Users/akhileshbitla/Work/products/Organize/src/images/extension_icon.png';

  function DisplayTabs() {
  const currGroups = useSelector(state => state.currGroups);
  const currGroupTabs = useSelector(state => state.currGroupTabs);
  const currTabs = useSelector(state => state.currTabs);
  const hostUrls = useSelector(state => state.hostUrls);
  const isGroupCollapsed = useSelector(state => state.isGroupCollapsed);
  const isGroupButtonDisabled = useSelector(state => state.isGroupButtonDisabled);
  const showModalArr = useSelector(state => state.showModalArr);
  const [currHostTabs, setCurrHostTabs] = useState([]);
  const [currHostUrl, setCurrHostUrl] = useState("");
  const dispatch = useDispatch();
  const collator = new Intl.Collator();
  return (
  <> { 
  hostUrls.map((hostUrl, index) => {
  const hostTabs = currTabs.filter((tab) => tab.url.includes(`://${hostUrl}/`)); // tab refers to the tab of each currTabs
  hostTabs.sort((a, b) => collator.compare(a.title, b.title)); // sorts by title for all hostTabs
    // TODO: clean this code:
  let favIcon_img = null;
  if (hostTabs[0] !== undefined) { // for localhost
    favIcon_img = hostTabs[0].favIconUrl;
    if (hostTabs[0].url.includes("chrome://newtab/")) { 
      favIcon_img = require('/Users/akhileshbitla/Work/products/Organize/src/images/chrome_icon.png').default;
    } else if (hostTabs[0].url.includes("chrome://extensions/")) {
      favIcon_img = require('/Users/akhileshbitla/Work/products/Organize/src/images/extension_icon.png').default;
    } else if (hostTabs[0].url.includes("chrome://history/")) {
      favIcon_img = require('/Users/akhileshbitla/Work/products/Organize/src/images/history_icon.png').default;
    } else if (hostTabs[0].url.includes("chrome://settings/")) {
      favIcon_img = require('/Users/akhileshbitla/Work/products/Organize/src/images/settings-icon.png').default;
    } else if (!hostTabs[0].favIconUrl) {
      favIcon_img = require('/Users/akhileshbitla/Work/products/Organize/src/images/favicon_url_not_found_icon.png').default
    }
  }
  // Group Title Logic:
  var hostTitle = groupTitle(hostUrl);
  const tabIds = hostTabs.map(({ id }) => id);
  const truncatedTitle = truncateText(hostTitle, 25);
  return (
    <div key={index} className=" col-md-4 mb-2">
      <div id={index} className="card card-tabs">
        <div className="card-header tab-header d-flex justify-content-between">
          <div className="left-side-items d-flex">
          <img className="favicon" src={favIcon_img} alt="" />

          <h4 className="header-text">{truncatedTitle}</h4>
          </div>
          <div id="right-side" className="right-side-items d-flex">
            <div id="grp-btn-div" className="group-btn-div">
            <button id="group-btn" className="group" 
            disabled={isGroupButtonDisabled[index]} 
            onClick= { async () => {
              if (showModalArr[index]) { 
                dispatch(setShowModal(true)); 
                dispatch(setCurrHostUrlIndex(index)); 
                setCurrHostTabs(hostTabs); setCurrHostUrl(hostUrl); 
                const mainBody = document.getElementById('main-body');
                mainBody.style.minHeight = '100vh';
              } else { 
              GroupAllTabs({tabIds, index, truncatedTitle, isGroupButtonDisabled, setGroupButtonDisabled, currTabs, setCurrTabs, currGroupTabs, 
              setCurrGroupTabs, currGroups, setCurrGroups, isGroupCollapsed, setIsGroupCollapsed, showModalArr, dispatch}).then((grpID) => {
              const groupButton = document.getElementById(index);
              groupButton.addEventListener('mouseover', async () => { await chrome.tabGroups.update(grpID, { collapsed: true });});
              });
              }}}>
              <FontAwesomeIcon icon={faLayerGroup} className="fa-layer-group group-icon fa-thin fa-lg ${isGroupButtonDisabled[index] ? 'disabled' : 'enabled'}" />
              <span className="tooltip group-label">{isGroupButtonDisabled[index] ? 'All Grouped' : 'Quick Group'}</span>
            </button>
            </div>
            {showModalArr[index] && (<GroupOnlySome currHostTabs={currHostTabs} setCurrHostTabs={setCurrHostTabs} 
            hostTabs={hostTabs} currHostUrl={currHostUrl} />)}

            <Dropdown className="card-settings">
            <Dropdown.Toggle variant="success">
              <FontAwesomeIcon icon={faEllipsisV} style={{ color: '#000000' }} className="fa-ellipsis-v fa-thin fa-lg" />    
            </Dropdown.Toggle>
            <Dropdown.Menu className="menu-dropdown">
            <Dropdown.Item onClick={async ()=> {
              await chrome.tabs.remove(tabIds, ()=>{});
              // updating tabs and corresponding host urls for tabs section
              const updatedTabs = currTabs.filter((tab) => !hostTabs.includes(tab));
              dispatch(setCurrTabs([...updatedTabs]));
              const updatedHostUrls = getHostUrls(updatedTabs);
              dispatch(setHostUrls([...updatedHostUrls]));
              const updatedDisabledState = isGroupButtonDisabled.filter((disabledState, stateIndex) => stateIndex !== index);
              dispatch(setGroupButtonDisabled(updatedDisabledState));
              const updatedShowModalState = showModalArr.filter((showModalState, stateIndex) => stateIndex !== index);
              dispatch(setShowModalArr(updatedShowModalState));

              var updatedCurrGroupTabs = []; 
              for (const groupTabs of currGroupTabs) {
                const updatedTabs = groupTabs.filter((tab) => !tabIds.includes(tab.id));
                if (updatedTabs.length > 0) {
                updatedCurrGroupTabs.push(updatedTabs);
                }
              } 

              // updating current groups
              const groupIds = updatedCurrGroupTabs.map((updatedGroupTabs) => updatedGroupTabs[0].groupId);
              const updatedGroups = currGroups.filter(({ id }) => groupIds.includes(id));
              const updatedCollapsedStates = updatedGroups.map((group) => group.collapsed);
              dispatch(setCurrGroupTabs([...updatedCurrGroupTabs]));
              dispatch(setCurrGroups(updatedGroups));
              dispatch(setIsGroupCollapsed(updatedCollapsedStates));
            }}>Close All Tabs</Dropdown.Item>
            </Dropdown.Menu>
            <span className="tooltip settings-label">Settings</span>
            </Dropdown>
          </div>
        </div>
        <ul className="list-group list-group-flush">
          <GetTabListForDT tabType={hostTabs} />
        </ul>
      </div>
    </div>
  );
  })}
  </>
  );
}

export default DisplayTabs;