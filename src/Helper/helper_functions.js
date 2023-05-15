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
