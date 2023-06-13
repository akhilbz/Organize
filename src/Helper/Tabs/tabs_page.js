import React from 'react';
import DisplayTabs from './display_tabs';
import NewGroupModal from './New_Group_Modal/new_group_modal';
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup, faShuffle, faObjectGroup } from '@fortawesome/free-solid-svg-icons';
import { setShowCheckboxesAndBtns, setAddTabIds, setGroupedTabIds, setShowGroupModal } from '../../actions';

function TabsPage() {
    const dispatch = useDispatch();
    const showCheckboxesAndBtns = useSelector(state => state.showCheckboxesAndBtns);
    const showGroupModal = useSelector(state => state.showGroupModal);
    const addTabIds = useSelector(state => state.addTabIds);
  return (
    <>
     <div className="tabs-groups-container container-fluid border-bottom">
      <div className="tab-section d-flex justify-content-between">
        <div className="d-flex">
        <h5 className="tab-head">Tabs</h5>
        <button className="group-tab-switch-btn">
            <FontAwesomeIcon icon={faObjectGroup} className="fa-layer-group fa-thin btn-group-icon group-tab-switch"/>
            <span className="tooltip">Groups</span>
        </button>
        </div>
        {!showCheckboxesAndBtns && (<button type="button" onClick={() => {
          dispatch(setShowCheckboxesAndBtns(true));}}
        className="btn btn-outline-warning new-group-btn">New Group</button>)}
        {showCheckboxesAndBtns && (<div className="d-flex">
        <button type="button" className="btn btn-outline-danger btn-group-cancel" onClick={() => {
          dispatch(setShowCheckboxesAndBtns(false));
          dispatch(setAddTabIds([]));
          dispatch(setGroupedTabIds([]));
        }}>Cancel</button>
        <button type="button" className="btn btn-warning new-group-grp-btn" onClick={() => {
          if (addTabIds.length > 0) {
            dispatch(setShowGroupModal(true));
          } else {
            // Add an accordion
          }
        }
        }>
        <FontAwesomeIcon icon={faLayerGroup} className="fa-layer-group fa-thin fa-lg btn-group-icon"/>
        </button>
        </div>)}
      </div>
      </div>
      <div className="tabs-section container-fluid">
      {showGroupModal && (<NewGroupModal />)}
      <DisplayTabs />
      </div>
    </>
  );
}

export default TabsPage;
