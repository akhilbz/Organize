import { getHostUrls } from "../../helper_functions";
import { GroupAllTabs } from "../group_no_modal";

export async function handleGroupAllTabs({ allCurrTabIds, currHostUrlIndex, truncatedTitle, currGroups, setCurrGroups, isGroupCollapsed, 
    setIsGroupCollapsed, currGroupTabs, setCurrGroupTabs, currTabs, setCurrTabs, hostUrls, currHostUrl, showModalArr, setShowModalArr, 
    isGroupButtonDisabled, setGroupButtonDisabled, dispatch}) {

    // This is to remove the existing group and groupedTabs and replace it with the new group
    var updatedCurrGroups = [];
    var removedCurrGroup = null;
    const allCurrTabIdsSet = new Set(allCurrTabIds);
    var collapsedStateIndex = 0;
    var updatedCollapsedStates = [];
    var updatedShowModalArr = [];
    var updatedCurrGroupTabs = [];
    var updatedGroupButtonDisabled = [];
    var updatedTabs = [];
    for (const group of currGroups) {
    if (group.title == truncatedTitle) {
        // console.log("we're here");
        removedCurrGroup = group; // retrieve the group that is removed
    } else {
        updatedCurrGroups.push(group);
        updatedCollapsedStates.push(isGroupCollapsed[collapsedStateIndex]);
    }            
    collapsedStateIndex++;              
    }
    // console.log(removedCurrGroup);
    // console.log(updatedCurrGroups);
    // console.log(updatedCollapsedStates);
    // dispatch(setIsGroupCollapsed([...updatedCollapsedStates]));
    console.log("updatedCurrGroups: ", updatedCurrGroups);
    // dispatch(setCurrGroups([...updatedCurrGroups])); 
    // console.log(removedCurrGroup);
    if (removedCurrGroup !== null) {
    // console.log("we passed the first big if stmt");
    var removedGroupedTabs = null; // a group that was formerly made with the "Quick Group" Button
    for (const currGroupTab of currGroupTabs) {
        if (currGroupTab[0].groupId !== removedCurrGroup.id) {
            const filteredGroupedTabs = currGroupTab.filter((groupedTab) => !allCurrTabIdsSet.has(groupedTab.id));
            // console.log("filteredGroupedTabs:", filteredGroupedTabs);
            // console.log("currGroupTab:", currGroupTab);
            if (filteredGroupedTabs.length > 0) { 
                // if length is 0, then it's either the only tab being filtered or there's nothing stored in the set
                updatedCurrGroupTabs.push(filteredGroupedTabs);
            } else if (currGroupTab.length > 1) { 
                // if length is 1, that means it's the tab (id) is stored in the set and we want to exclude that because it should be removed
                updatedCurrGroupTabs.push(currGroupTab);
            }
        } else {
            removedGroupedTabs = currGroupTab; // retrieve the grouped tabs that are removed
        }
    }
    // dispatch(setCurrGroupTabs([...updatedCurrGroupTabs]));
    // console.log(updatedCurrGroupTabs);

    const notSameHost_Tabs = removedGroupedTabs.filter((removedTab) => !allCurrTabIdsSet.has(removedTab.id));
    // console.log(notSameHost_Tabs);
    // if tabs with other host urls are stored in the same group, then we need to update the following state variables accordingly:
    // if (notSameHost_Tabs.length != 0) {          
        const notSameHost_TabsIds = notSameHost_Tabs.map((tab) => tab.id);
        for (const tab of currTabs) {
            if ((notSameHost_TabsIds.some((t) => t === tab.id) && notSameHost_TabsIds.length > 0) || (allCurrTabIdsSet.has(tab.id) && tab.groupId !== -1)) {
                const tempTab = Object.assign({}, tab); // storing tab in a temorary object
                tempTab.groupId = -1;
                updatedTabs.push(tempTab);
            } else {
                updatedTabs.push(tab);
            }
        }
        // dispatch(setCurrTabs([...updatedTabs]));


        // Must update the disabled state of group button and model's open/closed state:
        const currHostUrlIndex = hostUrls.indexOf(currHostUrl);

        var removedTabHostUrls = [];
        var removedTabHostUrlIndexes = [];   
        var removedTabHostUrlIndexesSet = null;   
        if (notSameHost_Tabs.length != 0) {
            await chrome.tabs.ungroup(notSameHost_TabsIds, ()=>{});
            removedTabHostUrls = [...getHostUrls(notSameHost_Tabs)];
            removedTabHostUrlIndexes = removedTabHostUrls.map((removedTabHostUrl) => hostUrls.indexOf(removedTabHostUrl)).filter((index) => index !== -1);   
            removedTabHostUrlIndexesSet = new Set(removedTabHostUrlIndexes);  
        }
        

        // Updates the open/closed state of modal:
        updatedShowModalArr = showModalArr.map((showModal, i) => {
            if (i === currHostUrlIndex) {
            return false;
            } else if (removedTabHostUrlIndexes.length > 0) {
                if (removedTabHostUrlIndexesSet.has(i)) {
                    const hostTabs = updatedTabs.filter((tab) => tab.url.includes(`://${hostUrls[i]}/`));
                    let nonGrouped = 0;
                    
                    if (hostTabs.length > 1) {
                        for (const tab of hostTabs) {
                            if (tab.groupId === -1) {
                                nonGrouped++;
                            }
                        }
                        
                        if (nonGrouped !== 0 && nonGrouped < hostTabs.length) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }
            }
            return showModal;
        });
        console.log(updatedShowModalArr);
        dispatch(setShowModalArr(updatedShowModalArr));

        // Updates the disabled state of quick group button:
        updatedGroupButtonDisabled = isGroupButtonDisabled.map((groupButtonDisabled, i) => {
            if (i === currHostUrlIndex) {
                return true;
            } else {
            const hostTabs = updatedTabs.filter((tab) => tab.url.includes(`://${hostUrls[i]}/`));
            var isDisabled = false;
            for (const tab of hostTabs) {
                if (tab.groupId !== -1) {
                    isDisabled = true;
                } else {
                    isDisabled = false;
                    break;
                }
            }
            return isDisabled;
            }
        });
        console.log(currGroups);
        console.log(isGroupCollapsed);
        console.log(updatedGroupButtonDisabled);
        // dispatch(setGroupButtonDisabled([...updatedGroupButtonDisabled])); 
    // } 
    } else {
        // If there are tabs from the same host url that are in other groups, update the following states:
        // update currGroups if size is only one & isGroupCollapsed
        // update currGroupTabs regardless (updated above)
        // update currTabs by making groupid -1
        console.log(currTabs);
        console.log("here");
        for (const currGroupTab of currGroupTabs) {
            const updatedGroupTab = currGroupTab.filter((groupedTab) => !allCurrTabIdsSet.has(groupedTab.id));
            // console.log(updatedGroupTab);
            updatedCurrGroupTabs.push(updatedGroupTab);
        }
        console.log(currGroupTabs);
        // console.log(updatedCurrGroupTabs);
        // dispatch(setCurrGroupTabs([...updatedCurrGroupTabs]));
        for (const tab of currTabs) {
            if (allCurrTabIdsSet.has(tab.id) && tab.groupId !== -1) {
                const tempTab = Object.assign({}, tab); // storing tab in a temorary object
                tempTab.groupId = -1;
                updatedTabs.push(tempTab);
            } else {
                updatedTabs.push(tab);
            }
        }
        // dispatch(setCurrTabs(updatedTabs));
        // dispatch(setCurrTabs(tabs => {
        //     const updatedTabs = [];
        //     for (const tab of tabs) {
        //         if (allCurrTabIdsSet.has(tab.id) && tab.groupId !== -1) {
        //             const tempTab = Object.assign({}, tab); // storing tab in a temorary object
        //             tempTab.groupId = -1;
        //             updatedTabs.push(tempTab);
        //         } else {
        //             updatedTabs.push(tab);
        //         }
        //     }
        //     console.log(updatedTabs);
        //     return updatedTabs;
        // }));
        const groupsIdSet = new Set(currGroups.map(({id}) => id));
        // const updatedCurrGroups = [];
        console.log(updatedCurrGroupTabs);
        for (const currGroupTab of updatedCurrGroupTabs) {
            if (groupsIdSet.has(currGroupTab[0].groupId)) {
                const group = currGroups.find(({ id }) => id === currGroupTab[0].groupId);
                const groupIndex = currGroups.indexOf(group);
                // console.log(group);
                if (group) {
                    updatedCurrGroups.push(group);
                }

                if (groupIndex !== -1) {
                    updatedCollapsedStates.push(isGroupCollapsed[groupIndex]);
                }
            }
        }
        console.log(updatedCurrGroups);
        // dispatch(setCurrGroups(updatedCurrGroups));
        console.log(isGroupCollapsed);
        // dispatch(setIsGroupCollapsed(updatedCollapsedStates));
        // dispatch(setShowModalArr((currShowModalArr) => {
        //     const updatedShowModalArr = [...currShowModalArr];
        //     updatedShowModalArr[currHostUrlIndex] = false;
        //     console.log(updatedShowModalArr);
        //     return updatedShowModalArr;
        // }));
        const updatedShowModalArr = [...showModalArr];
        updatedShowModalArr[currHostUrlIndex] = false;
        dispatch(setShowModalArr(updatedShowModalArr));
        updatedGroupButtonDisabled = [...isGroupButtonDisabled];
        updatedGroupButtonDisabled[currHostUrlIndex] = true;
        // dispatch(setGroupButtonDisabled(updatedGroupButtonDisabled));
        // dispatch(setGroupButtonDisabled((currDisabledState) => {
        //     const updatedGroupButtonDisabled = [...currDisabledState];
        //     updatedGroupButtonDisabled[currHostUrlIndex] = true;
        //     console.log(updatedGroupButtonDisabled);
        //     return updatedGroupButtonDisabled;
        // }));
    } 
        // } else {
        //     console.log("why are you here?");
        //     // Must ungroup the tabs from different groups and set them to -1
        //     // Must update the currGroupTabs so it doesn't store those groups
        //     // 
        //     // TODO: Work on this and set it all up

        // }   
        // GroupAllTabs({ tabIds, index, truncatedTitle, isGroupButtonDisabled, setGroupButtonDisabled, currTabs, 
        //     setCurrTabs, currGroupTabs, setCurrGroupTabs, currGroups, setCurrGroups, isGroupCollapsed, setIsGroupCollapsed, dispatch }) {
        //     console.log(currGroups);
        GroupAllTabs({ tabIds: allCurrTabIds, currHostUrlIndex, truncatedTitle, isGroupButtonDisabled: updatedGroupButtonDisabled, setGroupButtonDisabled, 
            currTabs: updatedTabs, setCurrTabs, currGroupTabs: updatedCurrGroupTabs, setCurrGroupTabs, currGroups: updatedCurrGroups, setCurrGroups, 
            isGroupCollapsed: updatedCollapsedStates, setIsGroupCollapsed, dispatch });     
}