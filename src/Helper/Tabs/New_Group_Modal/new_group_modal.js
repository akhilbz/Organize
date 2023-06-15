import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setShowGroupModal, setShowCheckboxesAndBtns, setAddTabIds, setGroupedTabIds } from "../../../actions";
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
    const currTabs = useSelector(state => state.currTabs);
    const currGroups = useSelector(state => state.currGroups);
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
                <div className="d-flex border-bottom"><h6 className="group-data-text">{"Group Color: "}</h6> <h6 className="group-data-text" 
                style={{color: getModdedColor(colorReceived)}}>{'\u00A0'}{colorReceived}</h6></div>
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
                If you wish to group the above tabs, press the 'Group Tabs' Button.</p></div>
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
                <button className="btn btn-outline-success">Group Tabs</button>
            </div>
            </Modal.Footer>
        </Modal>
    );
}
export default NewGroupModal;