import React, { useState } from "react";
import { Modal } from 'react-bootstrap';

function GroupOnlySome({hostUrl, index, showModal, setShowModal, currHostTabs, setCurrHostTabs, currGroups, currGroupTabs}) {
    const [showAll, setShowAll] = useState(false);
    const MAX_VISIBLE_ITEMS = 4;
    // console.log(currHostTabs);
    const tabIds = currHostTabs.map(({ id }) => id);
    // console.log("testing");
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
            const groupedTabs = currHostTabs.filter((tab) => tab.groupId == group.id && tabIds.includes(tab.id));
            groupedTabsArr.push(...groupedTabs);
        }
    }
    console.log(showAll);
    const visibleGroupedTabsArr = showAll ? groupedTabsArr : groupedTabsArr.slice(0, MAX_VISIBLE_ITEMS);
    console.log(visibleGroupedTabsArr);
    return (
        <div key={index}>
        <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
            <Modal.Title>Group Tabs</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
            (<button className="show-more-button" onClick={!showAll ? handleShowMore : handleShowLess}>Show More</button>)}

            </Modal.Body>
            <Modal.Footer>
            </Modal.Footer>
        </Modal>
        </div>
    );
}

export default GroupOnlySome;