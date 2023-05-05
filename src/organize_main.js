const curr_tabs = await chrome.tabs.query({ currentWindow: true });

const collator = new Intl.Collator();
curr_tabs.sort((a, b) => collator.compare(a.title, b.title)); // sort by title
const host_urls = new Set(); // set of host URLs (used as category names)

for (const curr_tab of curr_tabs) {

    const url_host = new URL(curr_tab.url).hostname; 
    host_urls.add(url_host);
}

// use for debugging:
// console.log(host_urls);
// console.log(curr_tabs);

const block_template = document.getElementById('block_template');
// stores each website of same hostname in a container
const host_blocks = new Array();

for (const host_url of host_urls) {
    // console.log(host_url);
    const host_tabs = await chrome.tabs.query({
        url: [
            'https://' + host_url + '/*',
            'http://' + host_url + '/*'
        ]
    });

    host_tabs.sort((a, b) => collator.compare(a.title, b.title)); // sorts by title for all host_tabs
    const host_data = block_template.content.firstElementChild.cloneNode(true);

    host_data.querySelector('.title').textContent = host_url;
    const li_template = document.getElementById('li_template'); 
    
    const elements = new Array();
    for (const tab of host_tabs) {
        const host_li_data = li_template.content.firstElementChild.cloneNode(true);

        var title = tab.title;
        if (tab.title.includes('-')) {
            title = tab.title.split('-')[0].trim();
        } else if (tab.title.includes('|')) {
            title = tab.title.split('|')[0].trim();
        } 

        host_li_data.querySelector('.sub-title').textContent = title;
        // element.querySelector('.pathname').textContent = pathname;

        host_li_data.querySelector('a').addEventListener('click', async () => {
          // need to focus window as well as the active tab
          await chrome.tabs.update(tab.id, { active: true });
          await chrome.windows.update(tab.windowId, { focused: true });
        });

        const close_button = host_li_data.querySelector('.close');
        close_button.addEventListener('click', async () => {
            chrome.tabs.remove(tab.id);
        });

        host_data.querySelector('ul').append(host_li_data);
      }
      
      const button = host_data.querySelector('button');
      button.addEventListener('click', async () => {
        const tabIds = host_tabs.map(({ id }) => id);
        const group = await chrome.tabs.group({ tabIds });
        await chrome.tabGroups.update(group, { title: 'DOCS' });
      });

      // used to display the data on to the extension
      document.querySelector('.container-fluid').append(host_data)
} 


