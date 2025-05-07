const copyKeys = document.getElementById("copyKeys");
const copyUrl = document.getElementById("copyUrl");
const downloadButton = document.getElementById("downloadButton");
const exitButton = document.getElementById("exitButton");
const keyInput = document.getElementById("keyInput");
copyKeys.addEventListener("click", () => {
  let v17 = keyInput.value;
  let v18 = v17.split("Decryption Keys:")[1];
  let v19 = document.createElement("textarea");
  document.body.appendChild(v19);
  v19.value = v18.trim();
  v19.select();
  document.execCommand("copy");
  document.body.removeChild(v19);
  alert("Decryption keys copied to clipboard");
});
copyUrl.addEventListener("click", () => {
  let v20 = keyInput.value;
  let v21 = v20.split("Stream Url(s):")[1].split("Decryption Keys:")[0];
  let v22 = document.createElement("textarea");
  document.body.appendChild(v22);
  v22.value = v21.trim();
  v22.select();
  document.execCommand("copy");
  document.body.removeChild(v22);
  alert("Stream Url(s) copied to clipboard");
});
downloadButton.addEventListener("click", () => {
  let v23 = keyInput.value;
  let v24 = v23.split("\n");
  let v25 = v24[0].substring(6).trim();
  let v26 = v23.split("Stream Url(s):")[1].split("Decryption Keys:")[0];
  v26 = v26.replace(/^\n+|\n+$/g, "");
  if (v26.includes("\n")) {
    let v27 = v26.split("\n");
    let vA2 = [];
    for (let vLN02 = 0; vLN02 < v27.length; vLN02++) {
      let v28 = v27[vLN02];
      if (v28.trim() !== "") {
        vA2.push(v28);
      }
    }
    v26 = vA2;
  }
  let vA3 = [];
  for (let vLN3 = 3; vLN3 < v24.length; vLN3++) {
    const v29 = v24[vLN3].trim();
    if (v29.startsWith("--key")) {
      let v30 = v29.split(":");
      let v31 = v30[0].substring(6);
      let v32 = v30[1];
      vA3.push({
        kid: v31,
        key: v32
      });
    }
  }
  let vA4 = [{
    init_data: v25,
    stream_url: v26,
    keys: v23.split("Decryption Keys:\n")[1].split("\n")
  }];
  let v33 = JSON.stringify(vA4, null, 2);
  let v34 = document.createElement("a");
  v34.href = "data:application/octet-stream," + encodeURIComponent(v33);
  v34.download = "keys.json";
  v34.click();
});
exitButton.addEventListener("click", () => {
  window.close();
});
