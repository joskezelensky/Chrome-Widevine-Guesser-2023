const tabIDs = {};
const streamUrls = {};
var apiUrl;
var apiKey;
let popup = null;
var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function () {
  try {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        let v17 = JSON.parse(xhr.responseText);
        apiUrl = v17.host;
        apiKey = v17.key;
      } else {
        alert("license.json file is missing from your addon.\nContact https://t.me/chromedecrypt for support");
      }
    }
  } catch (e2) {
    alert("Error Loading api host and key from license.json file.\nContact https://t.me/chromedecrypt for support");
  }
};
xhr.open("GET", "license.json", true);
xhr.send();
function decryptKeys(p7) {
  let vP7 = p7;
  let v18 = tabIDs[p7];
  let v19 = streamUrls[p7];
  let v20 = JSON.stringify(v18);
  let vLS = "";
  let v21 = streamUrls[p7].urls || [];
  console.log(v21);
  if (v21.length !== 0) {
    if (v21.length === 1) {
      vLS = v21[0];
    } else {
      for (let v22 of v21) {
        vLS += "\n" + v22;
      }
    }
  } else {
    vLS = "\nKeys were extracted successfully as shown below but the stream urls were not captured.\nTry reloading the page once.\nIf it still doesn't work but you want them to be displayed.\nContact https://t.me/chromedecrypt for support";
  }
  streamUrls[p7].urls = [];
  var v23 = new XMLHttpRequest();
  v23.open("POST", apiUrl, true);
  v23.setRequestHeader("chrome-api-key", apiKey);
  v23.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  v23.onload = function () {
    try {
      let v24 = this.responseText;
      let v25 = JSON.parse(v24);
      console.log(v25);
      if (v25.message === "success") {
        let v26 = v25.keys;
        console.log(v26);
        chrome.browserAction.setBadgeBackgroundColor({
          color: "#00FF00",
          tabId: vP7
        });
        chrome.browserAction.setBadgeText({
          text: "✅",
          tabId: vP7
        });
        if (popup && !popup.closed) {
          popup.document.getElementById("keyInput").value = "PSSH: " + v18?.init_data + "\n\nStream Url(s): " + vLS + "\n\nDecryption Key(s):\n" + v26;
          popup.focus();
        } else {
          const vLN700 = 700;
          const vLN500 = 500;
          const v27 = (screen.width - vLN700) / 2;
          const v28 = (screen.height - vLN500) / 2;
          popup = window.open("popup.html", "Decryption Keys", "width=" + vLN700 + ",height=" + vLN500 + ",left=" + v27 + ",top=" + v28 + ",resizable=false");
          popup.onload = function () {
            popup.document.getElementById("keyInput").value = "PSSH: " + v18?.init_data + "\n\nStream Url(s): " + vLS + "\n\nDecryption Keys:\n" + v26;
            const v29 = popup.document.querySelector(".box");
            const v30 = v29.offsetWidth;
            const v31 = v29.offsetHeight;
            popup.resizeTo(v30 + 40, v31 + 80);
          };
        }
      } else {
        alert("Contact https://t.me/chromedecrypt for support");
      }
    } catch (e3) {
      alert("Contact https://t.me/chromedecrypt for support");
    }
  };
  v23.send(v20);
}
function getStreamLinks(p8) {
  streamUrls[p8.tabId] = streamUrls[p8.tabId] || {};
  if (p8.method == "GET") {
    if (!p8.url.includes("mediaResource") && !p8.url.includes("tracker") && !p8.url.includes("youboranqs01") && !p8.url.includes("infinity-c20") && !p8.url.includes(".dash?") && !p8.url.includes(".mp4?") && !p8.url.includes("/Fragments") && !p8.url.includes(".m4s?") && !p8.url.endsWith(".dash") && !p8.url.endsWith(".mp4") && !p8.url.endsWith(".m4s")) {
      if (p8.url.includes(".mpd") || p8.url.includes(".ism") || p8.url.includes("manifest")) {
        streamUrls[p8.tabId] = {
          urls: streamUrls[p8.tabId].urls ?? []
        };
        if (!streamUrls[p8.tabId].urls.includes(p8.url)) {
          console.log(p8.url);
          streamUrls[p8.tabId].urls.push(p8.url);
        }
      } else if (p8.url.includes("m3u8") && !p8.url.includes(".ts") && !p8.url.includes(".m4a")) {
        streamUrls[p8.tabId] = {
          urls: streamUrls[p8.tabId].urls ?? []
        };
        if (!streamUrls[p8.tabId].urls.includes(p8.url)) {
          console.log(p8.url);
          streamUrls[p8.tabId].urls.push(p8.url);
        }
      } else if (p8.url.includes("googlevideo.com/videoplayback/id/") && p8.url.includes("itag") && p8.url.includes("?range=") && !p8.url.includes("redirector")) {
        streamUrls[p8.tabId] = {
          urls: streamUrls[p8.tabId].urls ?? []
        };
        let v32 = p8.url;
        let v33 = v32.indexOf("?");
        if (v33 !== -1) {
          v32 = v32.substring(0, v33);
        }
        if (!streamUrls[p8.tabId].urls.includes(v32)) {
          console.log(v32);
          streamUrls[p8.tabId].urls.push(v32);
        }
      } else if (p8.url.includes("nflxvideo.net") && p8.url.includes("range") && !p8.url.includes("&sc=")) {
        streamUrls[p8.tabId] = {
          urls: streamUrls[p8.tabId].urls ?? []
        };
        let v34 = p8.url;
        let v35 = v34.indexOf("range/");
        let v36 = v34.indexOf("?");
        let v37 = v34.substring(0, v35) + v34.substring(v36);
        if (!streamUrls[p8.tabId].urls.includes(v37)) {
          console.log(v37);
          streamUrls[p8.tabId].urls.push(v37);
        }
      }
    }
  }
}
chrome.webRequest.onBeforeRequest.addListener(getStreamLinks, {
  urls: ["<all_urls>"],
  types: ["xmlhttprequest"]
}, ["requestBody"]);
chrome.runtime.onMessage.addListener((p9, p10, p11) => {
  if (!p9 || !p10.tab) {
    return;
  }
  tabIDs[p10.tab.id] = tabIDs[p10.tab.id] || {};
  if (p9.message.startsWith("CAES")) {
    tabIDs[p10.tab.id] = {
      init_data: tabIDs[p10.tab.id].init_data ?? "",
      license_request: p9.message,
      license_response: tabIDs[p10.tab.id].license_response ?? "",
      session: p9.session_id
    };
  } else if (p9.message.startsWith("CAIS") && p9.message.length > 500) {
    if (p9.session_id === tabIDs[p10.tab.id].session) {
      tabIDs[p10.tab.id] = {
        init_data: tabIDs[p10.tab.id].init_data ?? "",
        license_request: tabIDs[p10.tab.id].license_request ?? "",
        license_response: p9.message,
        session: tabIDs[p10.tab.id].session ?? ""
      };
      console.log(tabIDs[p10.tab.id]);
      decryptKeys(p10.tab.id);
    }
  } else if (!p9.message.startsWith("CAUS") && !p9.message.startsWith("CAQ") && !p9.message.startsWith("Cr")) {
    tabIDs[p10.tab.id] = {
      init_data: p9.message,
      license_request: tabIDs[p10.tab.id].license_request ?? "",
      license_response: tabIDs[p10.tab.id].license_response ?? "",
      session: tabIDs[p10.tab.id].session ?? ""
    };
  }
});
