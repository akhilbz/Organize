
export async function GroupAllTabs({ tabIds, index, truncatedTitle, isGroupButtonDisabled, setGroupButtonDisabled, currTabs, 
    setCurrTabs, currGroupTabs, setCurrGroupTabs, currGroups, setCurrGroups, isGroupCollapsed, setIsGroupCollapsed, showModalArr, dispatch }) {
    console.log(currGroups);
    var groupID = await chrome.tabs.group({ tabIds });  
    await chrome.tabGroups.update( groupID, { collapsed: true, title: truncatedTitle });
    const group = await chrome.tabGroups.get(groupID);
    console.log(isGroupButtonDisabled);
    const updatedGroupButtonDisabled = [...isGroupButtonDisabled];
    updatedGroupButtonDisabled[index] = true;
    dispatch(setGroupButtonDisabled(updatedGroupButtonDisabled));

    const tabs_in_group = await chrome.tabs.query({groupId: groupID});
    var tabs_are_included = false;      

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
        tabs_are_included = JSON.stringify(currGroupTabs).includes(tab.id);
    }
    // console.log(tabs_are_included);
    // TODO: Redo this logic
    // TODO: Implement the Modal and rework the logic based on the two buttons provided there
    if (!tabs_are_included) {
        const updatedGroupTabs = [...currGroupTabs, [...tabs_in_group]];
        const updatedGroups = [...currGroups, group];
        const updatedCollapsedStates = [...isGroupCollapsed, !group.collapsed];
        dispatch(setCurrGroupTabs(updatedGroupTabs)); // remember to rework the currGroupTabs
        dispatch(setCurrGroups(updatedGroups));
        dispatch(setIsGroupCollapsed(updatedCollapsedStates));
    }
    dispatch(setCurrTabs([...updatedTabs]));

    // if (showModalArr[index]) {
    //     const remGroupButton = document.getElementById('rem-group-btn');
    //     const allGroupButton = document.getElementById('all-group-btn');

    //     remGroupButton.addEventListener('mousedown', async () => {
    //         await chrome.tabGroups.update(groupID, { collapsed: true });
    //     });

    //     allGroupButton.addEventListener('mousedown', async () => {
    //         await chrome.tabGroups.update(groupID, { collapsed: true });
    //     });

    // } else {
    //     console.log("here");
    //     const groupButton = document.getElementById('group-btn');
    //     groupButton.addEventListener('mousedown', async () => {
    //         await chrome.tabGroups.update(groupID, { collapsed: true });
    //     });
    // }
}