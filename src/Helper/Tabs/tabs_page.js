import React, { useEffect } from 'react';
import DisplayTabs from './display_tabs';
import NewGroupModal from './New_Group_Modal/new_group_modal';
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup, faObjectGroup } from '@fortawesome/free-solid-svg-icons';
import { setShowCheckboxesAndBtns, setAddTabIds, setGroupedTabIds, setShowGroupModal, setSwitchToGroups } from '../../actions';
import { main } from '@popperjs/core';

function TabsPage() {
    const dispatch = useDispatch();
    const showCheckboxesAndBtns = useSelector(state => state.showCheckboxesAndBtns);
    const showGroupModal = useSelector(state => state.showGroupModal);
    const addTabIds = useSelector(state => state.addTabIds);
    return (
    <>
     {/* <div className="tabs-groups-container container-fluid border-bottom"> */}
      <div className="tab-section d-flex justify-content-between tabs-groups-container container-fluid border-bottom">
        <div className="d-flex">
        <h5 className="tab-head">Tabs</h5>
        <button className="group-tab-switch-btn" onClick={() => dispatch(setSwitchToGroups(true))}>
            <FontAwesomeIcon icon={faObjectGroup} className="fa-layer-group fa-thin btn-group-icon group-tab-switch"/>
            <span className="tooltip">Groups</span>
        </button>
        </div>
        {!showCheckboxesAndBtns && (<button type="button" id="new-grp" onClick={() => {
          dispatch(setShowCheckboxesAndBtns(true));
        }}
        className="btn btn-outline-warning new-group-btn">New Group</button>)}
        {showCheckboxesAndBtns && (<div className="d-flex">
        <button type="button" className="btn btn-outline-danger btn-group-cancel" onClick={() => {
          dispatch(setShowCheckboxesAndBtns(false));
          dispatch(setAddTabIds([]));
          dispatch(setGroupedTabIds([]));
        }}>Cancel</button>
        <button className="btn btn-warning new-group-grp-btn" disabled={addTabIds.length == 0} onClick={() => {
          if (addTabIds.length > 0) {
            const mainBody = document.getElementById('main-body');
            mainBody.style.minHeight = '100vh';
            dispatch(setShowGroupModal(true));
          }
        }}>
          <FontAwesomeIcon icon={faLayerGroup} className="fa-layer-group fa-thin fa-lg btn-group-icon"/>
          <span className="tooltip grp-tooltip">{addTabIds.length == 0 ? 'Pick your Tabs' : 'Group Tabs'}</span>
        </button>
        </div>)}
      </div>
      {/* </div> */}
      <div className="tabs-section container-fluid">
      {showGroupModal && (<NewGroupModal />)}
      <DisplayTabs />
      </div>
    </>
  );
}

export default TabsPage;
