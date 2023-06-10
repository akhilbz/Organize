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
      return "#9fb0e0";
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

export function getColorFromPosition(positionPercent) {
  const colors = ['grey', 'red', 'orange', 'yellow', 'cyan', 'green', 'blue', 'purple', 'pink'];
  // console.log(positionPercent);
  const colorIndex = Math.floor(positionPercent * (colors.length - 1));
  // console.log(positionPercent * (colors.length - 1));
  return colors[colorIndex];
  }

  export function modifyClampedScroller(clampedScrollerX) {
    if (clampedScrollerX <= 30) {
      clampedScrollerX = 25; 
    } else if (clampedScrollerX <= 75) {
      clampedScrollerX = 60;
    } else if (clampedScrollerX <= 120) {
      clampedScrollerX = 110;
    } else if (clampedScrollerX <= 155) {
      clampedScrollerX = 145;
    } else if (clampedScrollerX <= 205) {
      clampedScrollerX = 195;
    } else if (clampedScrollerX <= 255) {
      clampedScrollerX = 240;
    } else if (clampedScrollerX <= 310) {
      clampedScrollerX = 300;
    } else if (clampedScrollerX <= 350) {
      clampedScrollerX = 340;
    } else {
      clampedScrollerX = 380;
    }
    return clampedScrollerX;
  }

  export function getBarColor(color) {
    switch (color) {
      case "grey":
        return "#777777";
      case "blue":
        return "#9fb0e0";
      case "red":
        return "#ff7f7f";
      case "yellow":
        return "#ffd34d";
      case "green":
        return "#6fd2ed";
      case "pink":
        return "#fb96b8";
      case "purple":
        return "#b78cd9";
      case "cyan":
        return "#8c9fda";
      case "orange":
        return "#ffa168";
      default:
        return color;
    }
  }
  
  
  
  
  
  
  