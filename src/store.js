import { configureStore } from '@reduxjs/toolkit';

const initialState = {
  currGroups: [],
  currGroupTabs: [],
  currTabs: [],
  hostUrls: [],
  isGroupCollapsed: [],
  isGroupButtonDisabled: [],
  showModal: false,
  showModalArr: [],
  currHostUrlIndex: -1,
  currActiveTab: null,
  showCheckboxesAndBtns: false,
  addTabIds: [],
  groupedTabIds: []
};

const rootReducer = (state = initialState, action) => {
  // Handle different actions here
  switch (action.type) {
    case 'SET_CURR_GROUPS':
      return { ...state, currGroups: [...action.payload] };
    case 'SET_CURR_GROUP_TABS':
      return { ...state, currGroupTabs: [...action.payload] };
    case 'SET_CURR_TABS':
      return { ...state, currTabs: [...action.payload] };
    case 'SET_HOST_URLS':
      return { ...state, hostUrls: action.payload };
    case 'SET_IS_GROUP_COLLAPSED':
      return { ...state, isGroupCollapsed: [...action.payload] };
    case 'SET_IS_GROUP_BUTTON_DISABLED':
      return { ...state, isGroupButtonDisabled: [...action.payload] };
      case 'SET_SHOW_MODAL':
        return { ...state, showModal: action.payload };
    case 'SET_SHOW_MODAL_ARR':
      return { ...state, showModalArr: action.payload };
    case 'SET_CURR_HOST_URL_INDEX':
      return { ...state, currHostUrlIndex: action.payload };
    case 'SET_CURR_ACTIVE_TAB':
      return { ...state, currActiveTab: action.payload };
    case 'SET_SHOW_CHECKBOXES_AND_BTNS':
      return { ...state, showCheckboxesAndBtns: action.payload };
    case 'SET_ADD_TAB_IDS':
      return { ...state, addTabIds: action.payload };
    case 'SET_GROUPED_TAB_IDS':
      return { ...state, groupedTabIds: action.payload };
    // Add more cases for other actions
    default:
      return state;
  }
};

const store = configureStore({
    reducer: rootReducer
  });

export default store;
