(async () => {
  const vF5 = (p7, p8 = 4) => p7.split("\n").map(p9 => Array(p8).fill(" ").join("") + p9).join("\n");
  const vO = {
    decode: p10 => Uint8Array.from(atob(p10), p11 => p11.charCodeAt(0)),
    encode: p12 => btoa(String.fromCharCode(...new Uint8Array(p12)))
  };
  const vF6 = (p13, p14) => new Proxy(p13, {
    apply: p14
  });
  const vF7 = (p15, p16, p17) => Object.defineProperty(p15, p16, {
    value: vF6(p15[p16], p17)
  });
  vF7(Navigator.prototype, "requestMediaKeySystemAccess", async (p18, p19, p20) => {
    const [v17, v18] = p20;
    console.groupCollapsed("[EME] Navigator::requestMediaKeySystemAccess\n" + ("    Key System: " + v17 + "\n") + "    Supported Configurations:\n" + vF5(JSON.stringify(v18, null, "    ")));
    console.trace();
    console.groupEnd();
    return p18.apply(p19, p20);
  });
  vF7(MediaKeySystemAccess.prototype, "createMediaKeys", async (p21, p22, p23) => {
    console.groupCollapsed("[EME] MediaKeySystemAccess::createMediaKeys\n" + ("    Key System: " + p22.keySystem + "\n") + "    Configurations:\n" + vF5(JSON.stringify(p22.getConfiguration(), null, "    ")));
    console.trace();
    console.groupEnd();
    return p21.apply(p22, p23);
  });
  vF7(MediaKeys.prototype, "setServerCertificate", async (p24, p25, p26) => {
    const [v19] = p26;
    console.groupCollapsed("[EME] MediaKeys::setServerCertificate\n" + ("    Server Certificate: " + vO.encode(v19)));
    console.trace();
    console.groupEnd();
    return p24.apply(p25, p26);
  });
  function f(p27) {
    const v20 = p27.target;
    const {
      sessionId: _0x4f35c9
    } = v20;
    const {
      message: _0x20209f,
      messageType: _0x1ed5d2
    } = p27;
    const v21 = v20.getEventListeners("message").filter(p28 => p28 !== f);
    const v22 = vO.encode(_0x20209f);
    const v23 = _0x4f35c9 || "(not available)";
    console.groupCollapsed("[EME] MediaKeySession::message\n" + ("    Session ID: " + v23 + "\n") + ("    Message Type: " + _0x1ed5d2 + "\n") + ("    Message: " + v22) + "\n    Listeners:", v21);
    console.trace();
    console.groupEnd();
    if (_0x1ed5d2 === "license-request") {
      license_request_session = {
        session_id: v23,
        message: v22
      };
      window.postMessage({
        type: "Chrome-CDM-Decryptor-EME-Logger-Message",
        log: license_request_session
      }, "*");
    }
  }
  function f2(p29) {
    const v24 = p29.target;
    const {
      sessionId: _0x596a9a
    } = v24;
    const v25 = v24.getEventListeners("keystatuseschange").filter(p30 => p30 !== f2);
    console.groupCollapsed("[EME] MediaKeySession::keystatuseschange\n" + ("    Session ID: " + (_0x596a9a || "(not available)") + "\n") + Array.from(v24.keyStatuses).map(([v26, v27]) => "    [" + v27.toUpperCase() + "] " + vO.encode(v26)).join("\n") + "\n    Listeners:", v25);
    console.trace();
    console.groupEnd();
  }
  vF7(MediaKeys.prototype, "createSession", (p31, p32, p33) => {
    const [v28] = p33;
    console.groupCollapsed("[EME] MediaKeys::createSession\n" + ("    Session Type: " + (v28 || "temporary (default)")));
    console.trace();
    console.groupEnd();
    const v29 = p31.apply(p32, p33);
    v29.addEventListener("message", f);
    v29.addEventListener("keystatuseschange", f2);
    return v29;
  });
  function f3(p34) {
    if (this == null) {
      return [];
    }
    const v30 = this[Symbol.for(f3)];
    if (v30 == null || v30[p34] == null) {
      return [];
    }
    return v30[p34];
  }
  EventTarget.prototype.getEventListeners = f3;
  vF7(EventTarget.prototype, "addEventListener", async (p35, p36, p37) => {
    if (p36 != null) {
      const [v31, v32] = p37;
      const v33 = Symbol.for(f3);
      if (!(v33 in p36)) {
        p36[v33] = {};
      }
      const v34 = p36[v33];
      if (!(v31 in v34)) {
        v34[v31] = [];
      }
      const v35 = v34[v31];
      if (v35.indexOf(v32) < 0) {
        v35.push(v32);
      }
    }
    return p35.apply(p36, p37);
  });
  vF7(EventTarget.prototype, "removeEventListener", async (p38, p39, p40) => {
    if (p39 != null) {
      const [v36, v37] = p40;
      const v38 = Symbol.for(f3);
      if (!(v38 in p39)) {
        return;
      }
      const v39 = p39[v38];
      if (!(v36 in v39)) {
        return;
      }
      const v40 = v39[v36];
      const v41 = v40.indexOf(v37);
      if (v41 >= 0) {
        if (v40.length === 1) {
          delete v39[v36];
        } else {
          v40.splice(v41, 1);
        }
      }
    }
    return p38.apply(p39, p40);
  });
  vF7(MediaKeySession.prototype, "generateRequest", async (p41, p42, p43) => {
    const [v42, v43] = p43;
    const v44 = vO.encode(v43);
    const v45 = p42.sessionId || "(not available)";
    console.groupCollapsed("[EME] MediaKeySession::generateRequest\n" + ("    Session ID: " + v45 + "\n") + ("    Init Data Type: " + v42 + "\n") + ("    Init Data: " + v44));
    console.trace();
    console.groupEnd();
    if (v44) {
      pssh_session = {
        session_id: v45,
        message: v44
      };
      window.postMessage({
        type: "Chrome-CDM-Decryptor-EME-Logger-Message",
        log: pssh_session
      }, "*");
    }
    return p41.apply(p42, p43);
  });
  vF7(MediaKeySession.prototype, "load", async (p44, p45, p46) => {
    const [v46] = p46;
    console.groupCollapsed("[EME] MediaKeySession::load\n" + ("    Session ID: " + (v46 || "(not available)")));
    console.trace();
    console.groupEnd();
    return p44.apply(p45, p46);
  });
  vF7(MediaKeySession.prototype, "update", async (p47, p48, p49) => {
    const [v47] = p49;
    const v48 = vO.encode(v47);
    const v49 = p48.sessionId || "(not available)";
    console.groupCollapsed("[EME] MediaKeySession::update\n" + ("    Session ID: " + v49 + "\n") + ("    Response: " + v48));
    console.trace();
    console.groupEnd();
    if (v48) {
      license_response_session = {
        session_id: v49,
        message: v48
      };
      window.postMessage({
        type: "Chrome-CDM-Decryptor-EME-Logger-Message",
        log: license_response_session
      }, "*");
    }
    return p47.apply(p48, p49);
  });
  vF7(MediaKeySession.prototype, "close", async (p50, p51, p52) => {
    console.groupCollapsed("[EME] MediaKeySession::close\n" + ("    Session ID: " + (p51.sessionId || "(not available)")));
    console.trace();
    console.groupEnd();
    return p50.apply(p51, p52);
  });
  vF7(MediaKeySession.prototype, "remove", async (p53, p54, p55) => {
    console.groupCollapsed("[EME] MediaKeySession::remove\n" + ("    Session ID: " + (p54.sessionId || "(not available)")));
    console.trace();
    console.groupEnd();
    return p53.apply(p54, p55);
  });
})();
