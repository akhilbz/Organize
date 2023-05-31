// used in display_tabs.js
export function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
}

// used in display_tabs.js
export function groupTitle(hostUrl) {
  const tld = hostUrl.split('.');
  var hostTitle = "";

  if (tld.length >= 3) { 
    if (tld[0] == "www") {
      for (let i = 1; i < tld.length - 1; i++) {
        hostTitle += tld[i];
      }
    } else {
      for (let i = 0; i < tld.length - 1; i++) {
        if (i == 1) {
          hostTitle += ".";
        }
        hostTitle += tld[i];
      }
    }
  } else if (tld.length > 1) {
      for (let i = 0; i < tld.length - 1; i++) {
        hostTitle += tld[i];
      }
  } else {
    hostTitle = tld[0];
  }

  return hostTitle;
}

export function getHostUrls(tabs) {
  const hostUrls = new Set();

  for (const tab of tabs) {
    const urlHost = new URL(tab.url).hostname;
    hostUrls.add(urlHost);
  }

  return hostUrls;
}

export function getModdedColor(color) {
  switch (color) {
    case "grey":
      return "#a9a9a9";
    case "blue":
      return "#8aa2d9";
    case "red":
      return "#ff8787";
    case "yellow":
      return "#fddc68";
    case "green":
      return "#68b670";
    case "pink":
      return "#fca5c3";
    case "purple":
      return "#c49de6";
    case "cyan":
      return "#7fd9e8";
    case "orange": 
    return "#ffac75";
  }
}