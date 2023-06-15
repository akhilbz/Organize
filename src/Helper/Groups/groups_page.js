import React from 'react';
import DisplayGroups from './display_groups';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faObjectUngroup } from '@fortawesome/free-solid-svg-icons';
import { setSwitchToGroups } from '../../actions';
import neutralFaceGif from '/Users/akhileshbitla/Work/products/Organize/src/images/neutral-face.gif';

function GroupsPage() {
    const currGroups = useSelector((state) => state.currGroups);
    const dispatch = useDispatch();
    return (
    <>
    <div className="tabs-groups-container container-fluid border-bottom d-flex justify-content-between">
      <div className="d-flex">
      <h5 className="group-head">Groups</h5>
      <button className="tab-group-switch-btn" onClick={() => dispatch(setSwitchToGroups(false))}>
            <FontAwesomeIcon icon={faObjectUngroup} className="fa-layer-ungroup fa-thin btn-group-icon tab-group-switch"/>
            <span className="tooltip">Tabs</span>
      </button>
      </div>
      <button type="button" disabled={currGroups == 0} className="btn btn-outline-info manage-btn">
        MANAGE
        <span className="tooltip manage-tip">No Groups to Manage</span>
      </button>
      </div>
      
      <div className="groups-section container-fluid">
        {(currGroups.length == 0) && (
        <div className="no-groups-pic-container container-fluid" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="no-groups-pic"><img className="empty-groups-pic" src={neutralFaceGif} alt="GIF" style={{ filter: 'grayscale(100%)' }}/></div>
          <h6 className="no-groups-text">Looks pretty lonely here...</h6>
        </div>)}
      {(currGroups.length > 0) && (<DisplayGroups/>)}
      </div>
    </>
  );
}

export default GroupsPage;
