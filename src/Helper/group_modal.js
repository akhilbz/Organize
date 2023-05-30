import React, { useState, useEffect } from "react";
import { GroupAllTabs } from "./group_no_modal";
import { truncateText, groupTitle, getHostUrls } from "./helper_functions";
import { Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';

function GroupOnlySome({currHostUrlIndex, showModal, setShowModal, currHostTabs, hostTabs, currHostUrl, hostUrls, currGroups, setCurrGroups, currGroupTabs, 
    setCurrGroupTabs, isGroupButtonDisabled, setGroupButtonDisabled, currTabs, setCurrTabs, isGroupCollapsed, setIsGroupCollapsed, showModalArr,
    setShowModalArr }) {
    const [showAll, setShowAll] = useState(false);
    // console.log(hostTabs);
    const MAX_VISIBLE_ITEMS = 4;
    const allCurrTabIds = currHostTabs.map(({ id }) => id);
    const remCurrTabIds = currHostTabs.filter(({ groupId }) => groupId === -1).map(({ id }) => id);
    var hostTitle = groupTitle(currHostUrl);
    const truncatedTitle = truncateText(hostTitle, 25);

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleShowMore = () => {
        setShowAll(true);
      };

    const handleShowLess = () => {
        setShowAll(false);
    };
    
    const groupedTabsArr = [];
    for (const group of currGroups) {
        // must be greater than 1 because if there's only  one tab within the hostCard, you only group all or don't group
        // we don't want to enable this special case by revealing the modal. That's only for some tabs that are not grouped while others are in the 
        // same host card.
        if (currHostTabs.length > 1) { 
            const groupedTabs = currHostTabs.filter((tab) => tab.groupId == group.id && allCurrTabIds.includes(tab.id));
            groupedTabsArr.push(...groupedTabs);
        }
    }
    const visibleGroupedTabsArr = showAll ? groupedTabsArr : groupedTabsArr.slice(0, MAX_VISIBLE_ITEMS);
    const handleGroupAllTabs = async () => {
        // This is to remove the existing group and groupedTabs and replace it with the new group
        var updatedCurrGroups = [];
        var removedCurrGroup = null;
        const allCurrTabIdsSet = new Set(allCurrTabIds);
        for (const group of currGroups) {
            if (group.title == truncatedTitle) {
                // console.log("we're here");
                removedCurrGroup = group; // retrieve the group that is removed
            } else {
                updatedCurrGroups.push(group);
            }                          
        }
        // console.log(removedCurrGroup);
        // console.log(updatedCurrGroups);
        setCurrGroups([...updatedCurrGroups]); 
        // console.log(removedCurrGroup);
        if (removedCurrGroup !== null) {
            // console.log("we passed the first big if stmt");
            var updatedCurrGroupTabs = [];
            var removedGroupedTabs = null; // a group that was formerly made with the "Quick Group" Button
            for (const currGroupTab of currGroupTabs) {
                if (currGroupTab[0].groupId !== removedCurrGroup.id) {
                    const filteredGroupedTabs = currGroupTab.filter((groupedTab) => !allCurrTabIdsSet.has(groupedTab.id));
                    // console.log("filteredGroupedTabs:", filteredGroupedTabs);
                    // console.log("currGroupTab:", currGroupTab);
                    if (filteredGroupedTabs.length > 0) { 
                        // if length is 0, then it's either the only tab being filtered or there's nothing stored in the set
                        updatedCurrGroupTabs.push(filteredGroupedTabs);
                    } else if (currGroupTab.length > 1) { 
                        // if length is 1, that means it's the tab (id) is stored in the set and we want to exclude that because it should be removed
                        updatedCurrGroupTabs.push(currGroupTab);
                    }
                } else {
                    removedGroupedTabs = currGroupTab; // retrieve the grouped tabs that are removed
                }
            }
            setCurrGroupTabs([...updatedCurrGroupTabs]);
            // console.log(updatedCurrGroupTabs);

            const notSameHost_Tabs = removedGroupedTabs.filter((removedTab) => !allCurrTabIdsSet.has(removedTab.id));
            // console.log(notSameHost_Tabs);
            // if tabs with other host urls are stored in the same group, then we need to update the following state variables accordingly:
            if (notSameHost_Tabs.length != 0) {          
                const notSameHost_TabsIds = notSameHost_Tabs.map((tab) => tab.id);
                await chrome.tabs.ungroup(notSameHost_TabsIds, ()=>{});
                var updatedTabs = [];
                for (const tab of currTabs) {
                    if (notSameHost_TabsIds.some((t) => t === tab.id)) {
                        const tempTab = Object.assign({}, tab); // storing tab in a temorary object
                        tempTab.groupId = -1;
                        updatedTabs.push(tempTab);
                    } else {
                        updatedTabs.push(tab);
                    }
                }
                setCurrTabs([...updatedTabs]);


                // Must update the disabled state of group button and model's open/closed state:
                const removedTabHostUrls = [...getHostUrls(notSameHost_Tabs)];
                const removedTabHostUrlIndexes = removedTabHostUrls.map((removedTabHostUrl) => hostUrls.indexOf(removedTabHostUrl)).filter((index) => index !== -1);   
                const removedTabHostUrlIndexesSet = new Set(removedTabHostUrlIndexes);   
                const currHostUrlIndex = hostUrls.indexOf(currHostUrl);

                // Updates the open/closed state of modal:
                const updatedShowModalArr = showModalArr.map((showModal, i) => {
                    if (i === currHostUrlIndex) {
                    return false;
                    } else if (removedTabHostUrlIndexesSet.has(i)) {
                    const hostTabs = updatedTabs.filter((tab) => tab.url.includes(`://${hostUrls[i]}/`));
                    let nonGrouped = 0;
                    
                    if (hostTabs.length > 1) {
                        for (const tab of hostTabs) {
                            if (tab.groupId === -1) {
                                nonGrouped++;
                            }
                        }
                        
                        if (nonGrouped !== 0 && nonGrouped < hostTabs.length) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                    }
                    return showModal;
                });
                
                setShowModalArr(updatedShowModalArr);

                // Updates the disabled state of quick group button:
                const updatedGroupButtonDisabled = isGroupButtonDisabled.map((groupButtonDisabled, i) => {
                    if (i === currHostUrlIndex) {
                        return true;
                    } else {
                    const hostTabs = updatedTabs.filter((tab) => tab.url.includes(`://${hostUrls[i]}/`));
                    var isDisabled = false;
                    for (const tab of hostTabs) {
                        if (tab.groupId !== -1) {
                            isDisabled = true;
                        } else {
                            isDisabled = false;
                            break;
                        }
                    }
                    return isDisabled;
                    }
                });
                // console.log(updatedGroupButtonDisabled);
                setGroupButtonDisabled([...updatedGroupButtonDisabled]); 
            } 
        } else {
                // If there are tabs from the same host url that are in other groups, update the following states:
                // update currGroups if size is only one & isGroupCollapsed
                // update currGroupTabs regardless (updated above)
                // update currTabs by making groupid -1
                // console.log(currTabs);
                var updatedCurrGroupTabs = [];
                for (const currGroupTab of currGroupTabs) {
                    const updatedGroupTab = currGroupTab.filter((groupedTab) => !allCurrTabIdsSet.has(groupedTab.id));
                    // console.log(updatedGroupTab);
                    updatedCurrGroupTabs.push(updatedGroupTab);
                }
                // console.log(currGroupTabs);
                // console.log(updatedCurrGroupTabs);
                setCurrGroupTabs([...updatedCurrGroupTabs]);
                setCurrTabs(tabs => {
                    const updatedTabs = [];
                    for (const tab of tabs) {
                        if (allCurrTabIdsSet.has(tab.id) && tab.groupId !== -1) {
                            const tempTab = Object.assign({}, tab); // storing tab in a temorary object
                            tempTab.groupId = -1;
                            updatedTabs.push(tempTab);
                        } else {
                            updatedTabs.push(tab);
                        }
                    }
                    // console.log(updatedTabs);
                    return updatedTabs;
                });
                const groupsIdSet = new Set(currGroups.map(({id}) => id));
                const updatedCurrGroups = [];
                const updatedGroupCollapsedState  = [];
                // console.log(updatedCurrGroupTabs);
                for (const currGroupTab of updatedCurrGroupTabs) {
                    if (groupsIdSet.has(currGroupTab[0].groupId)) {
                        const group = currGroups.find(({ id }) => id === currGroupTab[0].groupId);
                        const groupIndex = currGroups.indexOf(group);
                        // console.log(group);
                        if (group) {
                            updatedCurrGroups.push(group);
                        }

                        if (groupIndex !== -1) {
                            updatedGroupCollapsedState.push(isGroupCollapsed[groupIndex]);
                        }
                    }
                }
                // console.log(updatedCurrGroups);
                setCurrGroups(updatedCurrGroups);
                setIsGroupCollapsed(updatedGroupCollapsedState);
                await setShowModalArr((currShowModalArr) => {
                    const updatedShowModalArr = [...currShowModalArr];
                    updatedShowModalArr[currHostUrlIndex] = false;
                    // console.log(updatedShowModalArr);
                    return updatedShowModalArr;
                });

                await setGroupButtonDisabled((currDisabledState) => {
                    const updatedGroupButtonDisabled = [...currDisabledState];
                    updatedGroupButtonDisabled[currHostUrlIndex] = true;
                    // console.log(updatedGroupButtonDisabled);
                    return updatedGroupButtonDisabled;
                });
            } 
        // } else {
        //     console.log("why are you here?");
        //     // Must ungroup the tabs from different groups and set them to -1
        //     // Must update the currGroupTabs so it doesn't store those groups
        //     // 
        //     // TODO: Work on this and set it all up

        // }        
    };
    return (
        <div key={currHostUrlIndex}>
        <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
            <Modal.Title>Group Tabs</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <div><h6 className="modal-subheading">Current Grouped Tabs Overview:</h6></div>
            <div className="modal-body-container">
                {
            visibleGroupedTabsArr.map((tab, index) => {
                var group_name = "";
                if (tab.groupId != -1) {
                    for (const group of currGroups) {
                        if (group.id == tab.groupId) {
                            group_name += group.title;
                        }
                    }
                }
                return (
                    <div key={index} className="modal-tab-data border-bottom d-flex justify-content-between">
                        <h6 className="grouped-tab-modal">{tab.title}</h6>
                        <h6 className="group-indicator">{group_name}</h6>
                    </div>
                );
            })}
            </div>
            {groupedTabsArr.length > MAX_VISIBLE_ITEMS && 
            (<div className="show-more-container d-flex justify-content-center">
            <button className="show-more-button" onClick={!showAll ? handleShowMore : handleShowLess}>
              <FontAwesomeIcon icon={faEllipsisH} style={{ color: '#000000' }} className="fa-ellipsis-h fa-thin fa-lg" />    
            </button>
          </div>)}
          <div className="modal-message-container"><p className="modal-sub-statement">The following tabs are already organized into groups. 
          If you wish to group all tabs, overriding existing groups, please press 'Group All'. 
          If you prefer to group the remaining tabs that are currently not grouped, please press 'Group Remaining'.</p></div>
            </Modal.Body>
            <Modal.Footer>
                <div className="d-flex justify-content-between">
                    <button className="btn btn-light" onClick={() => GroupAllTabs({tabIds: remCurrTabIds, currHostUrlIndex, truncatedTitle, 
                    setGroupButtonDisabled, currTabs, setCurrTabs, currGroupTabs, setCurrGroupTabs, currGroups, 
                    setCurrGroups, isGroupCollapsed, setIsGroupCollapsed})}>Group Remaining</button>

                    <button className="btn btn-outline-danger" onClick={async () => {
                        handleGroupAllTabs();    
                        GroupAllTabs({tabIds: allCurrTabIds, currHostUrlIndex, truncatedTitle, setGroupButtonDisabled, 
                        currTabs, setCurrTabs, currGroupTabs, setCurrGroupTabs, currGroups, setCurrGroups, 
                        isGroupCollapsed, setIsGroupCollapsed});
                        handleCloseModal();
                        }}>Group All</button>
                </div>
            </Modal.Footer>
        </Modal>
        </div>
    );
}

export default GroupOnlySome;