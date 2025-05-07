(() => {
  'use strict';

  window.addEventListener("message", p7 => {
    if (p7.source != window) {
      return;
    }
    if (p7.data.type && p7.data.type === "Chrome-CDM-Decryptor-EME-Logger-Message") {
      if (p7.data.log) {
        chrome.runtime.sendMessage(p7.data.log);
      }
    }
  }, false);
  const v17 = document.createElement("script");
  v17.type = "text/javascript";
  v17.defer = false;
  v17.async = false;
  v17.src = chrome.extension.getURL("/eme-logger-mod.js");
  (document.head || document.documentElement).appendChild(v17);
  v17.remove();
})();
