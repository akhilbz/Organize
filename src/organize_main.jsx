import React, { useState, useEffect } from "react";
import { Provider, useSelector, useDispatch } from "react-redux";
import store from "./store";
import { setCurrGroups,  setCurrGroupTabs, setCurrTabs, setHostUrls, setIsGroupCollapsed, setGroupButtonDisabled,
  setShowModalArr, setCurrActiveTab, setShowCheckboxesAndBtns, setAddTabIds, setGroupedTabIds, setShowGroupModal} from "./actions";
import TabsPage from "./Helper/Tabs/tabs_page";
import GroupsPage from "./Helper/Groups/groups_page";
import NewGroupModal from "./Helper/Tabs/New_Group_Modal/new_group_modal";
import DisplayTabs from "./Helper/Tabs/display_tabs.js";
import DisplayGroups from "./Helper/Groups/display_groups.js";
import { getHostUrls } from "./Helper/helper_functions.js";
import { createRoot } from 'react-dom/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import organize_brand_logo from '/Users/akhileshbitla/Work/products/Organize/src/images/organize-logo7.png';

const container = document.getElementById("react-target");

 function Popup() {
  const dispatch = useDispatch();
  const collator = new Intl.Collator();

  useEffect(() => {
    async function fetchData() {
      const tabs = await chrome.tabs.query({ currentWindow: true });
      // console.log(tabs);
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
      dispatch(setCurrTabs(tabs));
      dispatch(setCurrActiveTab(activeTab[0]));
      dispatch(setHostUrls([...urls]));
      dispatch(setCurrGroups([...groups])); 
      dispatch(setCurrGroupTabs([...tabsInGroups]));
      dispatch(setIsGroupCollapsed([...collapsedGroupStates]));
      dispatch(setGroupButtonDisabled([...isButtonDisabled]));
      dispatch(setShowModalArr([...isModalEnabled]));
      dispatch(setShowCheckboxesAndBtns(false));
    }
    fetchData();
  }, []);

  const switchToGroups = useSelector(state => state.switchToGroups);
  return (
    <div className="main_body" id="main-body">
    <nav className="navbar fixed-top border-bottom">
      <div><a className="navbar-brand mb-2 h1" href="#">
        <img src={organize_brand_logo} alt="Brand Logo" className="brand-logo" />
        </a></div>
      <button className="search "><FontAwesomeIcon icon={faSearch} style={{ color: '#000000' }} className="fa-search fa-thin fa-lg" /></button>
    </nav>
     {!switchToGroups && (<TabsPage/>)}
     {switchToGroups && (<GroupsPage/>)}
    </div>
  );
}

const root = createRoot(container);
root.render(
  <Provider store={store}>
    <Popup />
  </Provider>
);
