import React, { useState, useEffect } from "react";
import DisplayTabs from "./Helper/Tabs/display_tabs.js";
import DisplayGroups from "./Helper/Groups/display_groups.js";
import { getHostUrls } from "./Helper/helper_functions.js";
import { createRoot } from 'react-dom/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import organize_brand_logo from '/Users/akhileshbitla/Work/products/Organize/src/images/organize-logo7.png';

const container = document.getElementById("react-target");

 function Popup() {
  const [currGroups, setCurrGroups] = useState([]);
  const [currGroupTabs, setCurrGroupTabs] = useState([]);
  const [currTabs, setCurrTabs] = useState([]);
  const [hostUrls, setHostUrls] = useState([]);
  const [isGroupCollapsed, setIsGroupCollapsed] = useState([]);
  const [isGroupButtonDisabled, setGroupButtonDisabled] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalArr, setShowModalArr] = useState([]);
  const [currHostUrlIndex, setCurrHostUrlIndex] = useState(-1);
  const [currActiveTab, setCurrActiveTab] = useState(null);
  const [showCheckboxesAndBtns, setShowCheckboxesAndBtns] = useState(false);
  const [addTabIds, setAddTabIds] = useState([]);
  const [groupedTabIds, setGroupedTabIds] = useState([]);
  const collator = new Intl.Collator();

  useEffect(() => {
    async function fetchData() {
      const tabs = await chrome.tabs.query({ currentWindow: true });
      const activeTab = tabs.filter((tab) => tab.active);
      const groups = await chrome.tabGroups.query({ windowId: chrome.windows.WINDOW_ID_CURRENT });
      groups.sort((a, b) => collator.compare(a.title, b.title));
      tabs.sort((a, b) => collator.compare(a.title, b.title)); // sort by title

      
      const tabsInGroups = []; // set of tabs in each group
      const collapsedGroupStates = []; // set of collapsed groups
      // Get all hostUrls
      const urls = getHostUrls(tabs); // set of host URLs (used as category names)


      // Store all tabs of each current group in an array
      for (const group of groups) {
        const tabs_in_group = await chrome.tabs.query({groupId: group.id});
        collapsedGroupStates.push(group.collapsed);
        tabsInGroups.push(tabs_in_group);
      }
       
      // Group Button Disabled/Enabled state:
      var isButtonDisabled = [];
      var isModalEnabled = [];
      for (const hostUrl of urls) {
        const hostTabs = tabs.filter((tab) => tab.url.includes(`://${hostUrl}/`));
        var isDisabled = false;
        for (const tab of hostTabs) {
          if (tab.groupId !== -1) {
            isDisabled = true;
          } else {
            isDisabled = false;
            break;
          }
        }
        isButtonDisabled.push(isDisabled);

        var notAllGrouped = false;
        var nonGrouped = 0;
        if (hostTabs.length > 1) {
            for (const tab of hostTabs) {
              if (tab.groupId === -1) {
                nonGrouped++;
              }
            }
        
            if (nonGrouped != 0 && nonGrouped < hostTabs.length) {
              notAllGrouped = true;
            } 
        }
        isModalEnabled.push(notAllGrouped);
      }
      
      setCurrTabs(tabs);
      setCurrActiveTab(activeTab[0]);
      setHostUrls([...urls]);
      setCurrGroups([...groups]); 
      setCurrGroupTabs([...tabsInGroups]);
      setIsGroupCollapsed([...collapsedGroupStates]);
      setGroupButtonDisabled([...isButtonDisabled]);
      setShowModalArr([...isModalEnabled]);

    }

    fetchData();
  }, []);

  return (
    <div className="main_body">
    <nav className="navbar fixed-top border-bottom">
      <div><a className="navbar-brand mb-2 h1" href="#">
        <img src={organize_brand_logo} alt="Brand Logo" className="brand-logo" />
        </a></div>
      <button className="search "><FontAwesomeIcon icon={faSearch} style={{ color: '#000000' }} className="fa-search fa-thin fa-lg" /></button>
    </nav>
    
    <div className="tabs-groups-container container-fluid">
      <div className="groups-section border-bottom">

      <h5 className="group-head">Groups</h5>
      <DisplayGroups currActiveTab={currActiveTab} setCurrActiveTab={setCurrActiveTab} currGroups={currGroups} setCurrGroups={setCurrGroups}
      currGroupTabs={currGroupTabs} setCurrGroupTabs={setCurrGroupTabs} currTabs={currTabs} setCurrTabs={setCurrTabs} hostUrls={hostUrls} 
      setHostUrls={setHostUrls} isGroupButtonDisabled={isGroupButtonDisabled} setGroupButtonDisabled={setGroupButtonDisabled} 
      showModalArr={showModalArr} setShowModalArr={setShowModalArr} currHostUrlIndex={currHostUrlIndex} 
      setCurrHostUrlIndex={setCurrHostUrlIndex} isGroupCollapsed={isGroupCollapsed} setIsGroupCollapsed={setIsGroupCollapsed} />
      </div>

      <div className="tab-section d-flex justify-content-between">
        <h5 className="tab-head">Tabs</h5>
        {!showCheckboxesAndBtns && (<button type="button" className="btn btn-outline-warning new-group-btn" onClick={() => {setShowCheckboxesAndBtns(true);}}>New Group</button>)}
        {showCheckboxesAndBtns && (<div className="d-flex">
        <button type="button" className="btn btn-outline-danger btn-group-cancel" onClick={() => {
          setShowCheckboxesAndBtns(false);
          setAddTabIds([]);
          setGroupedTabIds([]);
        }}>Cancel</button>
        <button type="button" className="btn btn-warning new-group-grp-btn" onClick="">
        <FontAwesomeIcon icon={faLayerGroup} className="fa-layer-group fa-thin fa-lg btn-group-icon"/>
        </button>
        </div>)}
      </div>
      <DisplayTabs currActiveTab={currActiveTab} setCurrActiveTab={setCurrActiveTab} currGroups={currGroups} setCurrGroups={setCurrGroups} 
      currGroupTabs={currGroupTabs} setCurrGroupTabs={setCurrGroupTabs} currTabs={currTabs} setCurrTabs={setCurrTabs} hostUrls={hostUrls} 
      setHostUrls={setHostUrls} isGroupButtonDisabled={isGroupButtonDisabled} setGroupButtonDisabled={setGroupButtonDisabled}
      showModal={showModal} setShowModal={setShowModal} showModalArr={showModalArr} setShowModalArr={setShowModalArr} 
      currHostUrlIndex={currHostUrlIndex} setCurrHostUrlIndex={setCurrHostUrlIndex} isGroupCollapsed={isGroupCollapsed} 
      setIsGroupCollapsed={setIsGroupCollapsed} showCheckboxesAndBtns={showCheckboxesAndBtns} 
      setShowCheckboxesAndBtns={setShowCheckboxesAndBtns} addTabIds={addTabIds} setAddTabIds={setAddTabIds} 
      groupedTabIds={groupedTabIds} setGroupedTabIds={setGroupedTabIds} collator={collator} />
      </div>
    </div>
  );
}

const root = createRoot(container);
root.render(<Popup />);
