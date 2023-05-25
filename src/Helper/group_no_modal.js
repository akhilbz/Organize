import React from "react";
// import { truncateText, groupTitle, getHostUrls } from "./helper_functions";

export async function GroupAllTabs({ tabIds, index, truncatedTitle, setGroupButtonDisabled, currTabs, setCurrTabs, currGroupTabs, 
    setCurrGroupTabs, currGroups, setCurrGroups }) {
    console.log(tabIds);
    var groupID = await chrome.tabs.group({ tabIds });  

    setGroupButtonDisabled((currDisabledState) => {
        const updatedGroupButtonDisabled = [...currDisabledState];
        updatedGroupButtonDisabled[index] = true;
        return updatedGroupButtonDisabled;
    });

    const tabs_in_group = await chrome.tabs.query({groupId: groupID});
    var tabs_are_included = false;      

    await chrome.tabGroups.update( groupID, { collapsed: true, title: truncatedTitle });
    const group = await chrome.tabGroups.get(groupID);

    var updatedTabs = [];
    for (const tab of currTabs) {
        const groupedTab = tabs_in_group.filter((groupedTab) => groupedTab.url == tab.url && groupedTab.id == tab.id); 
        if (groupedTab.length != 0) {
        updatedTabs.push(...groupedTab);
        } else {
        updatedTabs.push(tab);
        }
    }

    for (const tab of tabs_in_group) {
        tabs_are_included = JSON.stringify(currGroupTabs).includes(tab.url);
    }
    // TODO: Redo this logic
    // TODO: Implement the Modal and rework the logic based on the two buttons provided there
    if (!tabs_are_included) {
        setCurrGroupTabs(currGroupTabs => [...currGroupTabs, [...tabs_in_group]]); // remember to rework the currGroupTabs
        setCurrGroups(currGroups => [...currGroups, group]);
    }
    setCurrTabs([...updatedTabs]);
}