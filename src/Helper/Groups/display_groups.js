import React from "react";
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


    const handleCollapseGroup = async (currGroupId, index) => {
      await chrome.tabGroups.update(currGroupId, { collapsed: !isGroupCollapsed[index] });
      const updatedGroupCollapsedState = [...isGroupCollapsed];
      updatedGroupCollapsedState[index] = !isGroupCollapsed[index];
      dispatch(setIsGroupCollapsed(updatedGroupCollapsedState));
    };
    return (
        <> {
        currGroups.map((currGroup, index) => {
            const currGroupId = currGroup.id;
            const groupTabs = currGroupTabs.filter((grpTab) => grpTab[0].groupId == currGroupId);
            const tabIds = groupTabs[0].map(({ id }) => id);
            return (
            <div key={index} className="col-md-4 mb-2 ">
              <div className="card">
                <div onClick={() => handleCollapseGroup(currGroupId, index)} className="collapse-feature card-header d-flex justify-content-between" 
                aria-expanded={!isGroupCollapsed[index]} aria-controls="collapseGroup${index}">
                  <div className="left-side-items d-flex">
                    <div className="circle" style={{backgroundColor: getModdedColor(currGroup.color)}}></div>
                    <h4 className={'header-text ' + (currGroup.title.length == 0 ? 'nameless-header-text' : '')}>{(currGroup.title.length == 0) ? "no_name" : currGroup.title}</h4>
                  </div>
                  <div className="group-right-side-items d-flex">  
                    <button className="ungroup-button" onClick={ async () => {
                        var updatedTabs = [];
                        var tempTab = null;
                        console.log(groupTabs[0]);
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
                            console.log("hostTabs:", hostTabs);
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
                          // console.log(updatedShowModalArrState);
                          dispatch(setShowModalArr(updatedShowModalArrState));
                          dispatch(setCurrHostUrlIndex(-1));
                    }}>
                      <FontAwesomeIcon icon={faSquareMinus} style={{ color: '#000000' }} className="fa-square-minus fa-thin fa-lg" />
                      <span className="tooltip">Ungroup</span>
                      </button>  
                      
                    <Dropdown className="card-settings" onClick={async (e) => {
                      e.preventDefault(); 
                      e.stopPropagation();}}>
                    <Dropdown.Toggle variant="success">
                      <FontAwesomeIcon icon={faEllipsisV} style={{ color: '#000000' }} className="fa-ellipsis-v fa-thin fa-lg" />    
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                    <Dropdown.Item onClick={ async () => {}}>Edit</Dropdown.Item>
                    <Dropdown.Item onClick={""}>Close Group</Dropdown.Item>
                    </Dropdown.Menu>
                    <span className="tooltip settings-label">Settings</span>
                    </Dropdown>
                  </div>
                </div>
                <Collapse className="collapse-container" in={!isGroupCollapsed[index]}>
                    <div id={'collapseGroup${index}'}>              
                    <ul className="list-group list-group-flush">
                      <GetTabListForDG tabType={groupTabs[0]} currGroupIndex={index} />
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