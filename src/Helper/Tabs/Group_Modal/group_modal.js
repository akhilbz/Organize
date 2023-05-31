import React, { useState, useEffect } from "react";
import { GroupAllTabs } from "../group_no_modal";
import { handleGroupAllTabs } from "./modal_groupAll";
import { truncateText, groupTitle, getHostUrls } from "../../helper_functions";
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
    console.log(isGroupCollapsed);
    const handleGroupRemTabs = async () => {
        console.log(currHostUrlIndex);
        setShowModalArr(currShowModalState => {
            const updatedShowModalArr = [...currShowModalState];
            // updatedShowModalArr[currHostUrlIndex] = false;
            const hostTabs = currTabs.filter((tab) => tab.url.includes(`://${hostUrls[currHostUrlIndex]}/`));
            var nonGrouped = 0;
            if (hostTabs.length > 1) {
                for (const tab of hostTabs) {
                  if (tab.groupId === -1) {
                    nonGrouped++;
                  }
                }
            
                if (nonGrouped != 0 && nonGrouped < hostTabs.length) {
                    updatedShowModalArr[currHostUrlIndex] = true;
                } else {
                    updatedShowModalArr[currHostUrlIndex]
                }
            }
            return updatedShowModalArr;
        });

        setGroupButtonDisabled(currGroupButtonDisabledState => {
            const updatedGroupButtonDisabled = [...currGroupButtonDisabledState];
            updatedGroupButtonDisabled[currHostUrlIndex] = true;
            return updatedGroupButtonDisabled;
        });
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
          If you wish to group all tabs, potentially overriding existing groups, please press 'Group All'. 
          If you prefer to group the remaining tabs that are currently not grouped, please press 'Group Remaining'.</p></div>
            </Modal.Body>
            <Modal.Footer>
                <div className="d-flex justify-content-between">
                    <button className="btn btn-light" onClick={() => {
                    handleGroupRemTabs();
                    GroupAllTabs({tabIds: remCurrTabIds, currHostUrlIndex, truncatedTitle, 
                    setGroupButtonDisabled, currTabs, setCurrTabs, currGroupTabs, setCurrGroupTabs, currGroups, 
                    setCurrGroups, isGroupCollapsed, setIsGroupCollapsed});
                    handleCloseModal();
                    }}>Group Remaining</button>

                    <button className="btn btn-outline-danger" onClick={async () => {
                        handleGroupAllTabs({ allCurrTabIds, currHostUrlIndex, truncatedTitle, currGroups, setCurrGroups, isGroupCollapsed, setIsGroupCollapsed,
                            currGroupTabs, setCurrGroupTabs, currTabs, setCurrTabs, hostUrls, currHostUrl, showModalArr, setShowModalArr, 
                            isGroupButtonDisabled, setGroupButtonDisabled});    
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