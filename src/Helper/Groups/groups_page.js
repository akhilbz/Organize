import React from 'react';
import DisplayGroups from './DisplayGroups';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-solid-svg-icons';

function GroupsPage() {
  return (
    <div className="groups-section border-bottom">
      <h5 className="group-head">Groups</h5>
      <DisplayGroups />
    </div>
  );
}

export default GroupsPage;
