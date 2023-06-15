
// action types
export const SET_CURR_GROUPS = 'SET_CURR_GROUPS';
export const SET_CURR_GROUP_TABS = 'SET_CURR_GROUP_TABS';
export const SET_CURR_TABS = 'SET_CURR_TABS';
export const SET_HOST_URLS = 'SET_HOST_URLS';
export const SET_IS_GROUP_COLLAPSED = 'SET_IS_GROUP_COLLAPSED';
export const SET_GROUP_BUTTON_DISABLED = 'SET_GROUP_BUTTON_DISABLED';
export const SET_SHOW_MODAL = 'SET_SHOW_MODAL';
export const SET_SHOW_MODAL_ARR = 'SET_SHOW_MODAL_ARR';
export const SET_CURR_HOST_URL_INDEX = 'SET_CURR_HOST_URL_INDEX';
export const SET_CURR_ACTIVE_TAB = 'SET_CURR_ACTIVE_TAB';
export const SET_SHOW_CHECKBOXES_AND_BTNS = 'SET_SHOW_CHECKBOXES_AND_BTNS';
export const SET_ADD_TAB_IDS = 'SET_ADD_TAB_IDS';
export const SET_GROUPED_TAB_IDS = 'SET_GROUPED_TAB_IDS';
export const SET_SHOW_GROUP_MODAL = 'SET_SHOW_GROUP_MODAL';
export const SET_SWITCH_TO_GROUPS = 'SET_SWITCH_TO_GROUPS';

// action creators

export const setCurrGroups = (groups) => ({
    type: SET_CURR_GROUPS,
    payload: groups
});

export const setCurrGroupTabs = (groupedTabs) => ({
    type: SET_CURR_GROUP_TABS,
    payload: groupedTabs
});

export const setCurrTabs = (tabs) => ({
    type: SET_CURR_TABS,
    payload: tabs
});

export const setHostUrls = (hostUrls) => ({
    type: SET_HOST_URLS,
    payload: hostUrls
});

export const setIsGroupCollapsed = (collapsedGroupStates) => ({
    type: SET_IS_GROUP_COLLAPSED,
    payload: collapsedGroupStates
});

export const setGroupButtonDisabled = (buttonDisabledStates) => ({
    type: SET_GROUP_BUTTON_DISABLED,
    payload: buttonDisabledStates
});

export const setShowModal = (showModal) => ({
    type: SET_SHOW_MODAL,
    payload: showModal
});

export const setShowModalArr = (modalEnabledStates) => ({
    type: SET_SHOW_MODAL_ARR,
    payload: modalEnabledStates
});

export const setCurrHostUrlIndex = (currHostUrl) => ({
    type: SET_CURR_HOST_URL_INDEX,
    payload: currHostUrl
});

export const setCurrActiveTab = (currActiveTab) => ({
    type: SET_CURR_ACTIVE_TAB,
    payload: currActiveTab
});

// New Group Button Actions

export const setShowGroupModal = (showGroupModal) => ({
    type: SET_SHOW_GROUP_MODAL,
    payload: showGroupModal
});

export const setShowCheckboxesAndBtns = (showCheckboxesAndBtns) => ({
    type: SET_SHOW_CHECKBOXES_AND_BTNS,
    payload: showCheckboxesAndBtns
});

export const setAddTabIds = (addTabIds) => ({
    type: SET_ADD_TAB_IDS,
    payload: addTabIds
});

export const setGroupedTabIds = (groupedTabIds) => ({
    type: SET_GROUPED_TAB_IDS,
    payload: groupedTabIds
});

export const setSwitchToGroups = (switchToGroups) => ({
    type: SET_SWITCH_TO_GROUPS,
    payload: switchToGroups
});