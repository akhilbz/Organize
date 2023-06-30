import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrTabs, setCurrGroups, setCurrGroupTabs, setIsGroupCollapsed, setGroupButtonDisabled, setShowModalArr, setCurrHostUrlIndex } from "../../actions";
import GetTabListForDG from "./get_tablistG";
import { Collapse, Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faSquareMinus } from '@fortawesome/free-solid-svg-icons';
import { getHostUrls, getModdedColor } from "../helper_functions";


  function DisplayGroups() {
      const currGroups = useSelector(state => state.currGroups);
      const currGroupTabs = useSelector(state => state.currGroupTabs);
      const currTabs = useSelector(state => state.currTabs);
      const hostUrls = useSelector(state => state.hostUrls);
      const isGroupCollapsed = useSelector(state => state.isGroupCollapsed);
      const isGroupButtonDisabled = useSelector(state => state.isGroupButtonDisabled);
      const showModalArr = useSelector(state => state.showModalArr);
      const dispatch = useDispatch();
      // console.log(currGroups);
      
    return (
        <> {
        currGroups.map((currGroup, index) => {
            // console.log(currGroup);
            const groupTabs = currGroupTabs.filter((grpTab) => grpTab[0].groupId == currGroup.id);
            const tabIds = groupTabs[0].map(({ id }) => id);

            return (
            <div key={index} className="col-md-4 mb-2 ">
              <div className="card">
                <div 
                onClick={ async () => { 
                  // console.log(currGroup.id);
                  try { await chrome.tabGroups.update(currGroup.id, { collapsed: !isGroupCollapsed[index] }); }
                  catch (e) { console.error(e); console.log("ignore error ^")}
                  const updatedGroupCollapsedState = [...isGroupCollapsed];
                  updatedGroupCollapsedState[index] = !isGroupCollapsed[index];
                  dispatch(setIsGroupCollapsed(updatedGroupCollapsedState));
                }} 
                onMouseDown={async () => {await chrome.tabGroups.update(currGroup.id, { color: currGroup.color });}}
                className="collapse-feature card-header d-flex justify-content-between" style={{ borderRadius: isGroupCollapsed[index] ? '0.375rem' : 'initial' }} 
                aria-expanded={!isGroupCollapsed[index]} aria-controls="collapseGroup${index}">
                  <div className="left-side-items d-flex">
                    <div className="circle" style={{backgroundColor: getModdedColor(currGroup.color)}}></div>
                    <h4 className={'header-text ' + (currGroup.title.length == 0 ? 'nameless-header-text' : '')}>{(currGroup.title.length == 0) ? "no_name" : currGroup.title}</h4>
                  </div>
                  <div className="group-right-side-items d-flex">  
                    <button className="ungroup-button" onClick={ async () => {
                        var updatedTabs = [];
                        var tempTab = null;
                        for (const tab of currTabs) {
                            if (groupTabs[0].some((groupedTab) => groupedTab.id === tab.id)) {
                                tempTab = Object.assign({}, tab); // storing tab in a temporary object
                                tempTab.groupId = -1;
                                updatedTabs.push(tempTab);
                            } else {
                                updatedTabs.push(tab);
                            }
                        }
                        // console.log(updatedTabs);
                        const updatedGroupTabs = currGroupTabs.filter((gTabs) => gTabs[0].groupId != groupTabs[0][0].groupId);
                        await chrome.tabs.ungroup(tabIds, ()=>{});

                        const updatedCollapseStates = isGroupCollapsed.filter((state, i) => i !== index);
                        dispatch(setIsGroupCollapsed(updatedCollapseStates));
                        // console.log(currGroup);
                        const updatedGroups = currGroups.filter((group) => group !== currGroup);
                        dispatch(setCurrGroupTabs(updatedGroupTabs));
                        dispatch(setCurrGroups(updatedGroups));    
                        dispatch(setCurrTabs(updatedTabs));

                        
                        const groupTabsUrls = [...getHostUrls(groupTabs[0])];
                        const hostUrlIndexes = groupTabsUrls.map((groupTabsUrl) => hostUrls.indexOf(groupTabsUrl)).filter((index) => index !== -1);                        
                        const updatedGroupButtonDisabled = [...isGroupButtonDisabled];
                        hostUrlIndexes.forEach((index) => updatedGroupButtonDisabled[index] = false);
                        dispatch(setGroupButtonDisabled(updatedGroupButtonDisabled));

                          const updatedShowModalArrState = [...showModalArr];
                          for (const urlIndex of hostUrlIndexes) {
                            var notAllGrouped = false;
                            var nonGrouped = 0;
                            const hostTabs = updatedTabs.filter((tab) => tab.url.includes(`://${hostUrls[urlIndex]}/`));
                            // console.log("hostTabs:", hostTabs);
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
                            updatedShowModalArrState[urlIndex] = notAllGrouped;
                          }
                          dispatch(setShowModalArr(updatedShowModalArrState));
                          dispatch(setCurrHostUrlIndex(-1));
                    }}>
                      <FontAwesomeIcon icon={faSquareMinus} style={{ color: '#000000' }} className="fa-square-minus fa-thin fa-lg" />
                      <span className="tooltip ungroup-label">Ungroup</span>
                      </button>  
                      
                    <Dropdown className="card-settings" onClick={(e) => {
                      e.preventDefault(); 
                      e.stopPropagation();}}>
                    <Dropdown.Toggle variant="success">
                      <FontAwesomeIcon icon={faEllipsisV} style={{ color: '#000000' }} className="fa-ellipsis-v fa-thin fa-lg" />    
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="group-dropdown-menu">
                    <Dropdown.Item>Edit</Dropdown.Item>
                    <Dropdown.Item>Close Group</Dropdown.Item>
                    </Dropdown.Menu>
                    <span className="tooltip settings-label">Settings</span>
                    </Dropdown>
                  </div>
                </div>
                <Collapse className="collapse-container" in={!isGroupCollapsed[index]}>
                    <div id={'collapseGroup${index}'}>              
                    <ul className="list-group list-group-flush">
                      <GetTabListForDG tabType={groupTabs[0]} currGroupIndex={index} currGroup={currGroup}/>
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