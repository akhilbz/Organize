import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrTabs, setCurrGroups, setCurrGroupTabs, setGroupButtonDisabled, setShowModalArr, setShowGroupModal, 
    setShowCheckboxesAndBtns, setAddTabIds, setGroupedTabIds } from "../../../actions";
import { Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import { getColorFromPosition, modifyClampedScroller, getModdedColor } from "../../helper_functions";

function NewGroupModal() {
    const dispatch = useDispatch();
    const [showAll, setShowAll] = useState(false);
    const [positionPercent, setPositionPercent] = useState(0.5);
    const [inputValue, setInputValue] = useState("");
    const handleCloseGroupModal = () => {
        dispatch(setShowGroupModal(false));
    };
    const handleShowMore = () => {
        dispatch(setShowAll(true));
      };

    const handleShowLess = () => {
        dispatch(setShowAll(false));
    };

    const handleChange = (event) => {
        setInputValue(event.target.value);
    };
    const showGroupModal = useSelector(state => state.showGroupModal);
    const groupedTabIds = useSelector(state => state.groupedTabIds);
    const groupedTabIdsSet = new Set(groupedTabIds);
    const addTabIds = useSelector(state => state.addTabIds);
    const hostUrls = useSelector(state => state.hostUrls);
    const currTabs = useSelector(state => state.currTabs);
    const currGroups = useSelector(state => state.currGroups);
    const currGroupTabs = useSelector(state => state.currGroupTabs);
    const groupedTabs = currTabs.filter((tab) => groupedTabIdsSet.has(tab.id));
    const MAX_VISIBLE_ITEMS = 4;
    const visibleGroupedTabs = showAll ? groupedTabs : groupedTabs.slice(0, MAX_VISIBLE_ITEMS);
    var textValue = "";
    useEffect(() => {
        const colorScroll = document.getElementById('colorScroll');
        const scroller = document.getElementById('scroller');
        let isDragging = false;
        let dragStartX = 0;
        let scrollerStartX = colorScroll.offsetWidth / 2;
        // console.log(scrollerStartX);
        // console.log(scroller.offsetWidth);
        scroller.addEventListener('mousedown', startDrag);

        function drag(event) {
            if (!isDragging) return;

            const currentX = event.pageX;
            const dragDelta = currentX - dragStartX;
            const newScrollerX = scrollerStartX + dragDelta;
            const minScrollX = 5;
            const maxScrollX = colorScroll.offsetWidth - scroller.offsetWidth + 2;
            // Restrict scroller position within the color scroll container
            var clampedScrollerX = Math.max(minScrollX, Math.min(maxScrollX, newScrollerX));
            scroller.style.left = `${clampedScrollerX}px`;
            // Calculate the selected color based on the position of the scroller
            const colorBarWidth = colorScroll.offsetWidth;
            const scrollerX = modifyClampedScroller(clampedScrollerX) + scroller.offsetWidth / 2;
            const positionPercent = scrollerX / colorBarWidth;
            setPositionPercent(positionPercent);
        }

        function stopDrag() {
            isDragging = false;
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', stopDrag);
        }

        function startDrag(event) {
            event.preventDefault(); // ensures that the default behavior associated with mousedown events on the scroller element is prevented
            isDragging = true;
            dragStartX = event.pageX;
            scrollerStartX = scroller.offsetLeft;
    
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDrag);
        }

        const inputElement = document.getElementById('myInput');


        // Clean up the event listeners when the component unmounts
        return () => {scroller.removeEventListener('mousedown', startDrag);};
    }, []); 
    const colorReceived = getColorFromPosition(positionPercent);
    return (
        <Modal show={showGroupModal && addTabIds.length > 0} onHide={() => {
            handleCloseGroupModal();
            dispatch(setShowCheckboxesAndBtns(false));
            dispatch(setAddTabIds([]));
            dispatch(setGroupedTabIds([]));
            const mainBody = document.getElementById('main-body');
            mainBody.style.minHeight = '';
            }}>
            <Modal.Header closeButton>
                <Modal.Title>New Group</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="txt-container"><input className="text-container" type="text" id="myInput" placeholder="Group Title"
                value={inputValue} onChange={handleChange} style={{ textIndent: '3px' }} /></div>
                <div className="color-container">
                <div className="color-scroll" id="colorScroll">
                <div className="color-bar" id="colorBar"></div>
                <div className="scroller" id="scroller"></div>
                </div>
                </div>
                <div className={groupedTabs.length > 0 ? "d-flex border-bottom" : "d-flex"}><h6 className="group-data-text">{"Group Color: "}</h6> <h6 className="group-data-text" 
                style={{color: getModdedColor(colorReceived)}}>{'\u00A0'}{colorReceived}</h6></div>
               {groupedTabs.length > 0 && (<>
               <div><h6 className="new-modal-subheading">Current Grouped Tabs Overview:</h6></div>
                <div className="modal-body-container">
                    {
                visibleGroupedTabs.map((tab, index) => {
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
                {groupedTabs.length > MAX_VISIBLE_ITEMS && 
                (<div className="show-more-container d-flex justify-content-center">
                <button className="show-more-button" onClick={!showAll ? handleShowMore : handleShowLess}>
                <FontAwesomeIcon icon={faEllipsisH} style={{ color: '#000000' }} className="fa-ellipsis-h fa-thin fa-lg" />    
                </button>
                </div>)}
                <div className="modal-message-container"><p className="modal-sub-statement">The following tabs are already organized into groups.
                If you wish to group the selected tabs, the above tabs will be moved to thew new group.</p></div>
                </>)}
            </Modal.Body>
            <Modal.Footer>
            <div className="d-flex new-group-mdl-btn">
                <button className="btn btn-danger" style={{marginRight: 8}} onClick={() => {
                    handleCloseGroupModal();
                    const mainBody = document.getElementById('main-body');
                    mainBody.style.minHeight = '';
                    dispatch(setShowCheckboxesAndBtns(false));
                    dispatch(setAddTabIds([]));
                    dispatch(setGroupedTabIds([]));
                    }}>Close</button>
                <button className="btn btn-outline-success" onClick={ async () => {
                    var groupID = await chrome.tabs.group({ tabIds: addTabIds });  
                    await chrome.tabGroups.update( groupID, { collapsed: true, title: inputValue, color: colorReceived });
                    const group = await chrome.tabGroups.get(groupID);
                    const addTabIdsSet = new Set(addTabIds);
                    const groupedTabIdsSet = new Set(groupedTabIds);
                    // update tabs:
                    var updatedTabs = [];
                    for (const tab of currTabs) {
                        if (addTabIdsSet.has(tab.id)) {
                            const tempTab = Object.assign({}, tab);
                            tempTab.groupId = groupID;
                            updatedTabs.push(tempTab);
                        } else {
                            updatedTabs.push(tab);
                        }
                    }
                    // console.log("updatedTabs:", updatedTabs);
                    dispatch(setCurrTabs(updatedTabs));
                    
                    // update group tabs
                    var updatedGroupTabs = []; 
                    if (currGroupTabs.length > 0) {
                        for (const groupTabs of currGroupTabs) {
                            var groupedTabs = [];
                            for (const groupTab of groupTabs) {
                                if (!groupedTabIdsSet.has(groupTab.id)) {
                                    groupedTabs.push(groupTab);
                                }
                            }
                            // console.log(groupedTabs);
                            if (groupedTabs.length > 0) {
                                updatedGroupTabs.push(groupedTabs);
                            }
                        }
                    }
                    var newlyGroupedTabs = updatedTabs.filter((tab) => addTabIdsSet.has(tab.id));
                    updatedGroupTabs.push(newlyGroupedTabs);
                    console.log(updatedGroupTabs);
                    dispatch(setCurrGroupTabs(updatedGroupTabs));

                    // update groups: 
                    console.log(currGroups);
                    var index = 0;
                    var updatedGroups = [];
                    if (currGroups.length > 0) {
                        updatedGroupTabs.forEach((groupTabs) => {
                            updatedGroups.push(...currGroups.filter((group) => group.id === groupTabs[0].groupId));
                        });
                    }
                    updatedGroups.push(group);
                    console.log(updatedGroups);
                    dispatch(setCurrGroups(updatedGroups));


                    var isButtonDisabled = [];
                    var isModalEnabled = [];
                    for (const hostUrl of hostUrls) {
                      const hostTabs = updatedTabs.filter((tab) => tab.url.includes(`://${hostUrl}/`));
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

                    dispatch(setGroupButtonDisabled([...isButtonDisabled]));
                    dispatch(setShowModalArr([...isModalEnabled]));

                    // update groupTabs:
                    handleCloseGroupModal();
                    dispatch(setShowCheckboxesAndBtns(false));
                    dispatch(setAddTabIds([]));
                    dispatch(setGroupedTabIds([]));
                    const mainBody = document.getElementById('main-body');
                    mainBody.style.minHeight = '';
                }}>Group Tabs</button>
            </div>
            </Modal.Footer>
        </Modal>
    );
}
export default NewGroupModal;