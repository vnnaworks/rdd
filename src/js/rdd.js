/*
    rdd - https://github.com/latte-soft/rdd

    Copyright (C) 2024-2025 Latte Softworks <latte.to> | MIT License
    Forked by WEAO < Long Live WEAO! >
*/
// fix for the phishing message on downloading Roblox (false positive)
if (window.location.hostname === "rdd.weao.xyz") { 
    const newUrl = window.location.href.replace("rdd.weao.xyz", "rdd.weao.gg");
    window.location.replace(newUrl);
}
const basePath = window.location.href.split("?")[0];
const usageMsg = `[*] USAGE: ${basePath}?channel=<CHANNEL_NAME>&binaryType=<BINARY_TYPE>&version=<VERSION_HASH>

    Binary Types:
    * WindowsPlayer
    * WindowsStudio64
    * MacPlayer
    * MacStudio
    
    Extra Notes:
    * If \`channel\` isn't provided, it will default to "LIVE" (pseudo identifier for
      the production channel)
    * You can provide \`binaryType\` to fetch the *latest* deployment on a channel, or
      BOTH \`binaryType\` and \`version\` to fetch a specific deployment of a specific
      binary type; for a specific \`version\`, you NEED to provide \`binaryType\` aswell
    * Hitting *Download Latest Version* will automatically fetch the latest deployment of Roblox
    * Hitting *Download Previous Version* will automatically fetch the previous deployment of Roblox (downgrade)
    * If you want to download a specific version, specify the version hash in the version field and hit *Download Specified Hash*
    * If you want to include the Roblox Launcher (by WEAO), check the include launcher checkbox

    You can also use an extra flag we provide, \`blobDir\`, for specifying where RDD
    should fetch deployment files/binaries from. This is ONLY useful for using
    different relative paths than normal, such as "/mac/arm64" which is specifically
    present on certain channels

    Blob Directories (Examples):
    * "/" (Default for WindowsPlayer/WindowsStudio64)
    * "/mac/" (Default for MacPlayer/MacStudio)
    * "/mac/arm64/"
    LONG LIVE WEAO! <3
    ..
`;

// const hostPath = "https://r2.weao.xyz"; // We replaced Roblox's S3 with our own R2 bucket to avoid CORS issues, seems to work! (this is now only a backup rdd was fixed)
const hostPath = "https://setup-aws.rbxcdn.com"; 
// Root extract locations for the Win manifests
const extractRoots = {
    player: {
        "RobloxApp.zip": "",
        "redist.zip": "",
        "shaders.zip": "shaders/",
        "ssl.zip": "ssl/",

        "WebView2.zip": "",
        "WebView2RuntimeInstaller.zip": "WebView2RuntimeInstaller/",

        "content-avatar.zip": "content/avatar/",
        "content-configs.zip": "content/configs/",
        "content-fonts.zip": "content/fonts/",
        "content-sky.zip": "content/sky/",
        "content-sounds.zip": "content/sounds/",
        "content-textures2.zip": "content/textures/",
        "content-models.zip": "content/models/",

        "content-platform-fonts.zip": "PlatformContent/pc/fonts/",
        "content-platform-dictionaries.zip": "PlatformContent/pc/shared_compression_dictionaries/",
        "content-terrain.zip": "PlatformContent/pc/terrain/",
        "content-textures3.zip": "PlatformContent/pc/textures/",

        "extracontent-luapackages.zip": "ExtraContent/LuaPackages/",
        "extracontent-translations.zip": "ExtraContent/translations/",
        "extracontent-models.zip": "ExtraContent/models/",
        "extracontent-textures.zip": "ExtraContent/textures/",
        "extracontent-places.zip": "ExtraContent/places/"
    },

    studio: {
        "RobloxStudio.zip": "",
        "RibbonConfig.zip": "RibbonConfig/",
        "redist.zip": "",
        "Libraries.zip": "",
        "LibrariesQt5.zip": "",

        "WebView2.zip": "",
        "WebView2RuntimeInstaller.zip": "",

        "shaders.zip": "shaders/",
        "ssl.zip": "ssl/",

        "Qml.zip": "Qml/",
        "Plugins.zip": "Plugins/",
        "StudioFonts.zip": "StudioFonts/",
        "BuiltInPlugins.zip": "BuiltInPlugins/",
        "ApplicationConfig.zip": "ApplicationConfig/",
        "BuiltInStandalonePlugins.zip": "BuiltInStandalonePlugins/",

        "content-qt_translations.zip": "content/qt_translations/",
        "content-sky.zip": "content/sky/",
        "content-fonts.zip": "content/fonts/",
        "content-avatar.zip": "content/avatar/",
        "content-models.zip": "content/models/",
        "content-sounds.zip": "content/sounds/",
        "content-configs.zip": "content/configs/",
        "content-api-docs.zip": "content/api_docs/",
        "content-textures2.zip": "content/textures/",
        "content-studio_svg_textures.zip": "content/studio_svg_textures/",

        "content-platform-fonts.zip": "PlatformContent/pc/fonts/",
        "content-platform-dictionaries.zip": "PlatformContent/pc/shared_compression_dictionaries/",
        "content-terrain.zip": "PlatformContent/pc/terrain/",
        "content-textures3.zip": "PlatformContent/pc/textures/",

        "extracontent-translations.zip": "ExtraContent/translations/",
        "extracontent-luapackages.zip": "ExtraContent/LuaPackages/",
        "extracontent-textures.zip": "ExtraContent/textures/",
        "extracontent-scripts.zip": "ExtraContent/scripts/",
        "extracontent-models.zip": "ExtraContent/models/",
        "studiocontent-models.zip": "StudioContent/models/",
        "studiocontent-textures.zip": "StudioContent/textures/"
    }
};

// Yes, these files on S3 are meant for "legacy bootstrappers", but they work great
// for purposes like this, and tracking. We also *can't* use clientsettings, due to
// CORS policies of course..
// Edited by WEAO to use our proprietary R2 Bucket (Should increase download speeds?)
// Only for WEAO R2 if Roblox breaks CORS again
/*
const binaryTypes = {
    WindowsPlayer: {
        versionFile: "/windows/version",
        blobDir: "/windows/"
    },
    WindowsStudio64: {
        versionFile: "/windows/versionQTStudio",
        blobDir: "/windows/"
    },
    MacPlayer: {
        versionFile: "/mac/version",
        blobDir: "/mac/"
    },
    MacStudio: {
        versionFile: "/mac/versionStudio",
        blobDir: "/mac/"
    },
};
*/

const binaryTypes = {
    WindowsPlayer: {
        versionFile: "/version",
        blobDir: "/"
    },
    WindowsStudio64: {
        versionFile: "/versionQTStudio",
        blobDir: "/"
    },
    MacPlayer: {
        versionFile: "/mac/version",
        blobDir: "/mac/"
    },
    MacStudio: {
        versionFile: "/mac/versionStudio",
        blobDir: "/mac/"
    },
}

const urlParams = new URLSearchParams(window.location.search);

const logBox = document.getElementById("logBox");
const form = document.getElementById("form");
const formDiv = document.getElementById("formDiv");
const progWrap = document.getElementById("progWrap");
const progFill = document.getElementById("progFill");
const progMsg = document.getElementById("progMsg");

function getLink() {
    const channelName = form.channel.value.trim() || form.channel.placeholder;
    let qs = `?channel=${encodeURIComponent(channelName)}&binaryType=${encodeURIComponent(form.binaryType.value)}`;

    const ver = form.version.value.trim();
    if (ver !== "") qs += `&version=${encodeURIComponent(ver)}`;

    if (form.compressZip.checked) qs += `&compressZip=true&compressionLevel=${form.compressionLevel.value}`;
    if (form.includeLauncher.checked) qs += `&includeLauncher=true`;
    qs += `&parallelDownloads=${form.parallelDownloads.checked}`;

    return basePath + qs;
};

function dlHash() { window.open(getLink(), "_blank"); };
function copyLink(btn) {
    navigator.clipboard.writeText(getLink());
    if (!btn || btn._copying) return;
    btn._copying = true;
    const label = btn.lastChild;
    label.textContent = ' Copied';
    setTimeout(() => {
        label.textContent = ' Copy Link';
        btn._copying = false;
    }, 2000);
};

async function fetchVersionInfo(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

async function dlLatest() { // Easy button to download the latest version of a binary! 
    const binaryType = form.binaryType.value;
    const channelName = form.channel.value.trim() || form.channel.placeholder;
    let versionHash;

    try {
    const currentDomain = window.location.hostname;

    const parts = currentDomain.split(".");
    const domain = parts.length > 2 ? parts.slice(-2).join(".") : currentDomain;
        
    const apiUrl = `https://${domain}/api/versions/current`;

    const data = await fetchVersionInfo(apiUrl);

    if (binaryType === "WindowsPlayer" || binaryType === "WindowsStudio64") {
        versionHash = data.Windows;
    } else if (binaryType === "MacPlayer" || binaryType === "MacStudio") {
        versionHash = data.Mac;
    } else {
        log("[!] Error: Unknown binary type for latest version download.");
        return;
    }

    let queryString = `?channel=${encodeURIComponent(channelName)}&binaryType=${encodeURIComponent(binaryType)}&version=${encodeURIComponent(versionHash)}`;
    const compressZip = form.compressZip.checked;
    const compressionLevel = form.compressionLevel.value;
    if (compressZip === true) {
        queryString += `&compressZip=true&compressionLevel=${compressionLevel}`;
    }

    const includeLauncher = form.includeLauncher.checked;
    if (includeLauncher === true) {
        queryString += `&includeLauncher=true`;
    }

    queryString += `&parallelDownloads=${form.parallelDownloads.checked}`;

    window.open(basePath + queryString, "_blank");

} catch (error) {
    log(`[!] Error fetching latest version: ${error.message}`);
    logWarpHint();
}
}

async function dlPrev() { 
    // Helps restart swift users to downgrade to exploit :sob: 
    const binaryType = form.binaryType.value;
    const channelName = form.channel.value.trim() || form.channel.placeholder;
    let versionHash;

    try {
        const currentDomain = window.location.hostname;
        const parts = currentDomain.split(".");
        const domain = parts.length > 2 ? parts.slice(-2).join(".") : currentDomain;

        const apiUrl = `https://${domain}/api/versions/past`;

        const data = await fetchVersionInfo(apiUrl);

        if (binaryType === "WindowsPlayer" || binaryType === "WindowsStudio64") {
            versionHash = data.Windows;
        } else if (binaryType === "MacPlayer" || binaryType === "MacStudio") {
            versionHash = data.Mac;
        } else {
            log("[!] Error: Unknown binary type for previous version download.");
            return;
        }

        let queryString = `?channel=${encodeURIComponent(channelName)}&binaryType=${encodeURIComponent(binaryType)}&version=${encodeURIComponent(versionHash)}`;
        const compressZip = form.compressZip.checked;
        const compressionLevel = form.compressionLevel.value;
        if (compressZip === true) {
            queryString += `&compressZip=true&compressionLevel=${compressionLevel}`;
        }

        queryString += `&parallelDownloads=${form.parallelDownloads.checked}`;

        window.open(basePath + queryString, "_blank");

    } catch (error) {
        log(`[!] Error fetching previous version: ${error.message}`);
        logWarpHint();
    }
}


function scrollEnd() {
    logBox.scrollTop = logBox.scrollHeight;
};

function escHtml(originalText) {
    return originalText
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
        .replace(/ /g, "&nbsp;")
        .replace(/\n/g, "<br>");
};

function log(msg = "", end = "\n", autoScroll = true) {
    const content = msg.trimEnd();
    if (!content) return;

    const entry = document.createElement("div");
    entry.className = "entry";

    let type = "l-def";
    let text = content;
    if (content.startsWith("[!]")) { type = "l-err";  text = content.slice(3).trim(); }
    else if (content.startsWith("[+]")) { type = "l-ok";   text = content.slice(3).trim(); }
    else if (content.startsWith("[*]")) { type = "l-info"; text = content.slice(3).trim(); }
    entry.classList.add(type);

    const now = new Date();
    const time = now.toLocaleTimeString("en-US", { hour12: false });

    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = time;

    const msgEl = document.createElement("span");
    msgEl.className = "msg";
    msgEl.textContent = text;

    entry.appendChild(badge);
    entry.appendChild(msgEl);
    logBox.appendChild(entry);
    logBox.style.display = 'flex';

    if (autoScroll) scrollEnd();
};

function logWarpHint() {
    const entry = document.createElement("div");
    entry.className = "entry l-err";

    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = new Date().toLocaleTimeString("en-US", { hour12: false });

    const msg = document.createElement("span");
    msg.className = "msg";
    msg.innerHTML = `Try using <a href="https://one.one.one.one/" target="_blank">Cloudflare WARP</a> to fix this. If it continues, <a href="https://discord.gg/weaoxyz" target="_blank">contact us on Discord</a>.`;

    entry.appendChild(badge);
    entry.appendChild(msg);
    logBox.appendChild(entry);
    logBox.style.display = 'flex';
    scrollEnd();
}

function logLink(url, autoScroll = true) {
    const entry = document.createElement("div");
    entry.className = "entry l-link";

    const now = new Date();

    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = now.toLocaleTimeString("en-US", { hour12: false });

    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.className = "msg";
    link.textContent = url;

    entry.appendChild(badge);
    entry.appendChild(link);
    logBox.appendChild(entry);
    logBox.style.display = 'flex';

    if (autoScroll) scrollEnd();
};

const progPct = document.getElementById("progPct");
const progEta = document.getElementById("progEta");
let _progressStartTime = null;

// Function to update the progress bar
function setProgress(percentage, message) {
    if (!_progressStartTime) _progressStartTime = Date.now();

    progWrap.style.display = 'flex';
    progFill.style.width = percentage + '%';
    progPct.textContent = percentage + '%';
    progMsg.textContent = message;

    if (percentage > 0 && percentage < 100) {
        const elapsed = (Date.now() - _progressStartTime) / 1000;
        const rate = percentage / elapsed;
        const secsLeft = Math.round((100 - percentage) / rate);
        if (secsLeft > 0) {
            const m = Math.floor(secsLeft / 60);
            const s = secsLeft % 60;
            progEta.textContent = m > 0 ? `${m}m ${s}s left` : `${s}s left`;
        }
    } else if (percentage >= 100) {
        progEta.textContent = '';
        _progressStartTime = null;
    }

    scrollEnd();
}

// Function to hide the progress bar
function hideProgress() {
    progWrap.style.display = 'none';
    progFill.style.width = '0%';
    progPct.textContent = '0%';
    progEta.textContent = '';
    _progressStartTime = null;
    progMsg.innerText = '';
}

// Prompt download
function saveFile(fileName, data, mimeType = "application/zip") {
    const blob = new Blob([data], { type: mimeType });

    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.style.cssText = "display:none";

    let button = document.createElement("button");
    button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Redownload`;
    button.className = "redownload-btn";
    button.title = fileName;
    button.addEventListener("click", () => link.click());

    document.body.appendChild(link);
    document.getElementById("progWrap").insertAdjacentElement("afterend", button);
    scrollEnd();

    link.click();
};

// Soley for the manifest etc
function request(url, callback, errorOnNotOk = true) {
    const httpRequest = new XMLHttpRequest();
    httpRequest.open("GET", url, true);

    // When the request is done later..
    httpRequest.onload = function () {
        // Handle req issues, and don't call-back
        const statusCode = httpRequest.status
        if (errorOnNotOk && (statusCode < 200 || statusCode >= 400)) {
            log(`[!] Request error (${statusCode}) @ ${url} - ${httpRequest.responseText}`);
            return;
        }

        callback(httpRequest.responseText, statusCode);
    };

    httpRequest.onerror = function (e) {
        log(`[!] Request error @ ${url}`);
    };

    httpRequest.send();
};

function xhrBin(url, callback, progressCallback = null) {
    const httpRequest = new XMLHttpRequest();

    httpRequest.open("GET", url, true);
    httpRequest.responseType = "arraybuffer";

    if (progressCallback) {
        httpRequest.onprogress = function(event) {
            if (event.lengthComputable) {
                const percentage = Math.round((event.loaded / event.total) * 100);
                progressCallback(percentage, event.loaded, event.total);
            }
        };
    }

    // When the request is done later..
    httpRequest.onload = function () {
        // Handle req issues, and don't call-back
        const statusCode = httpRequest.status
        if (statusCode != 200) {
            log(`[!] Binary request error (${statusCode}) @ ${url}`);
            return;
        }

        const arrayBuffer = httpRequest.response;
        if (!arrayBuffer) {
            log(`[!] Binary request error (${statusCode}) @ ${url} - Failed to get binary ArrayBuffer from response`);
            return;
        }

        callback(arrayBuffer, statusCode);
    };

    httpRequest.onerror = function (e) {
        log(`[!] Binary request error @ ${url} - ${e}`);
    };

    httpRequest.send();
};

function fetchBin(url, progressCallback = null) {
    return new Promise((resolve, reject) => {
        const httpRequest = new XMLHttpRequest();
        httpRequest.open("GET", url, true);
        httpRequest.responseType = "arraybuffer";

        if (progressCallback) {
            httpRequest.onprogress = function(event) {
                if (event.lengthComputable) {
                    progressCallback(event.loaded, event.total);
                }
            };
        }

        httpRequest.onload = function() {
            if (httpRequest.status !== 200) {
                reject(new Error(`HTTP ${httpRequest.status}`));
                return;
            }
            if (!httpRequest.response) {
                reject(new Error("No ArrayBuffer in response"));
                return;
            }
            resolve(httpRequest.response);
        };

        httpRequest.onerror = function() {
            reject(new Error("Network error"));
        };

        httpRequest.send();
    });
};

function getQuery(queryString) {
    if (!urlParams.has(queryString)) {
        return null;
    }

    return urlParams.get(queryString) || null;
};

let channel = getQuery("channel");
let version = getQuery("version") || getQuery("guid");
let binaryType = getQuery("binaryType");
let blobDir = getQuery("blobDir");

let compressZip = getQuery("compressZip");
let compressionLevel = getQuery("compressionLevel");
let includeLauncher = getQuery("includeLauncher");
let parallelDownloads = getQuery("parallelDownloads");
let exploit = getQuery("exploit");

let channelPath;
let versionPath;

let binExtractRoots;
let zip;

// Init
main();

async function main() {
    if (window.location.search == "") {
        // We won't log anything else; just exit
        formDiv.hidden = false;
        document.getElementById("usageDiv").hidden = false;
        return;
    }

    // Query params

    if (channel) {
        if (channel.toLowerCase() === "live" || channel.toLowerCase() === "production") {
            channel = "LIVE";
        } else {
            channel = channel.toLowerCase();
        }
    } else {
        channel = "LIVE";
    }

    if (channel === "LIVE") {
        channelPath = `${hostPath}`;
    } else {
        channelPath = `${hostPath}/channel/${channel}`;
    }

    if (version) {
        version = version.toLowerCase();
        if (!version.startsWith("version-")) { // Only the version GUID is actually necessary
            version = "version-" + version
        }
    }


    // We're also checking to make sure blobDir hasn't been included too for the compatibility warning later
    if (version && !binaryType) {
        log("[!] Error: If you provide a specific `version`, you need to set the `binaryType` aswell! See the usage doc below for examples of various `binaryType` inputs:", "\n\n");
        log(usageMsg, "\n", false);
        return;
    }

    if (blobDir) {
        if (blobDir.slice(0) !== "/") {
            blobDir = "/" + blobDir;
        }
        if (blobDir.slice(-1) !== "/") {
            blobDir += "/"
        }

        // We used to support usage of ONLY `blobDir` & `version` in the past, requiring us
        // to essentially "guess" the desired binaryType ourselves! (how fun, right!?)
        if (!binaryType) {
            log(`[!] Error: Using the \`blobDir\` query without defining \`binaryType\` has been
    deprecated, and can no longer be used in requests. If you were using \`blobDir\`
    explicitly for MacPlayer/MacStudio with "blobDir=mac" or "/mac", please replace
    blobDir with a \`binaryType\` of either MacPlayer or MacStudio respectively`, "\n\n");

            log(usageMsg, "\n", false);
            return;
        }
    }

    if (compressZip) {
        if (compressZip !== "true" && compressZip !== "false") {
            log(`[!] Error: The \`compressZip\` query must be a boolean ("true" or "false"), got "${compressZip}"`);
        }

        compressZip = (compressZip === "true");
    } else {
        compressZip = form.compressZip.checked;
    }

    if (compressionLevel !== "") {
        try {
            compressionLevel = parseInt(compressionLevel);
        } catch (err) {
            log(`[!] Error: Failed to parse \`compressionLevel\` query: ${error}`, "\n\n");
            log(usageMsg, "\n", false);
            return;
        }

        if (compressionLevel > 9 || compressionLevel < 1) {
            log(`[!] Error: The \`compressionLevel\` query must be a value between 1 and 9, got ${compressionLevel}`, "\n\n");
            log(usageMsg, "\n", false);
            return;
        }
    } else {
        compressionLevel = form.compressionLevel.value; // Only applies to when `compressZip` is true aswell
    }

    if (includeLauncher) {
        if (includeLauncher !== "true" && includeLauncher !== "false") {
            log(`[!] Error: The \`includeLauncher\` query must be a boolean ("true" or "false"), got "${includeLauncher}"`);
            return;
        }

        includeLauncher = (includeLauncher === "true");
    } else {
 
        includeLauncher = false;
    }

    // At this point, we expect `binaryType` to be defined if all is well on input from the user..
    if (!binaryType) {
        if (exploit) {
            formDiv.hidden = false;
            return;
        }
        // Again, we used to support specific versions without denoting binaryType explicitly
        log("[!] Error: Missing required \`binaryType\` query, are you using an old perm link for a specific version?", "\n\n");
        log(usageMsg, "\n", false);
        return;
    }

    let versionFilePath; // Only used if `version` isn't already defined (later, see code below the if-else after this)
    if (binaryType in binaryTypes) {
        const binaryTypeObject = binaryTypes[binaryType];
        versionFilePath = channelPath + binaryTypeObject.versionFile;

        // If `blobDir` has already been defined by the user, we don't want to override it here..
        if (!blobDir) {
            blobDir = binaryTypeObject.blobDir;
        }
    } else {
        log(`[!] Error: \`binaryType\` given, "${binaryType}" not supported. See list below for supported \`binaryType\` inputs:`, "\n\n");
        log(usageMsg);
        return;
    }

    if (exploit && !version) {
        try {
            const hn = window.location.hostname.split('.');
            const base = hn.length > 2 ? `${location.protocol}//${hn.slice(-2).join('.')}` : `${location.protocol}//${hn.join('.')}`;
            const list = await fetch(`${base}/api/status/exploits`).then(r => r.json());
            const m = list.find(e => e.title.toLowerCase() === exploit.toLowerCase());
            if (m?.rbxversion) {
                version = m.rbxversion;
                log(`[*] Resolved exploit "${m.title}" → ${version}`);
            } else {
                log(`[!] Could not find exploit "${exploit}" or it has no version.`);
                return;
            }
        } catch (err) {
            log(`[!] Failed to fetch exploit version for "${exploit}": ${err.message}`);
            logWarpHint();
            return;
        }
    }

    if (version) {
        fetchManifest();
    } else {
        try {
            const currentDomain = window.location.hostname;
            const parts = currentDomain.split(".");
            const domain = parts.length > 2 ? parts.slice(-2).join(".") : currentDomain;
            const data = await fetchVersionInfo(`https://${domain}/api/versions/current`);

            if (binaryType === "WindowsPlayer" || binaryType === "WindowsStudio64") {
                version = data.Windows;
            } else if (binaryType === "MacPlayer" || binaryType === "MacStudio") {
                version = data.Mac;
            }

            if (!version) {
                log("[!] Could not resolve version for the selected binary type.");
                return;
            }

            if (!version.startsWith("version-")) version = "version-" + version;
            log(`[*] No version specified, resolved to latest: ${version}`);
            fetchManifest();
        } catch (error) {
            log(`[!] Failed to auto-fetch version: ${error.message}`);
            logWarpHint();
        }
    }
};

async function fetchManifest() {
   // versionPath = `${channelPath}${blobDir}${version}/`; // WEAO's R2 uses a / instead of - for the path :)
    versionPath = `${channelPath}${blobDir}${version}-`; // aws s3 uses a - for the path :)

    if (binaryType === "MacPlayer" || binaryType === "MacStudio") {
        const zipFileName = (binaryType == "MacPlayer" && "RobloxPlayer.zip") || (binaryType == "MacStudio" && "RobloxStudioApp.zip")
        log(`[+] Fetching zip archive for BinaryType "${binaryType}" (${zipFileName})`);

        const outputFileName = `WEAO-${channel}-${binaryType}-${version}.zip`; // little promo dont hurt right? :D
        log(`[+] (Please wait!) Downloading ${outputFileName}..`, "");

        setProgress(0, `Starting download for ${zipFileName}...`);
        xhrBin(versionPath + zipFileName, function (zipData) {
            const elapsed = ((Date.now() - _startTime) / 1000).toFixed(1);
            log(`done! Completed in ${elapsed}s`);
            log("Thank you for using WEAO RDD! If you have any issues, please report them at our discord server: https://discord.gg/weaoxyz");
            hideProgress();
            saveFile(outputFileName, zipData);
        }, function(percentage, loaded, total) {
            setProgress(percentage, `Downloading ${zipFileName}: ${fmtBytes(loaded)} / ${fmtBytes(total)}`);
        });
    } else {
        log(`[+] Fetching rbxPkgManifest for ${version}@${channel}..`);

        // TODO: We dont support RDDs /common but should work fine since its our own R2 bucket lol?
        var manifestBody = "";
        try {
            const resp = await fetch(versionPath + "rbxPkgManifest.txt");
            if (!resp.ok) {
                if (resp.status === 404) {
                    log("[!] Oh no! It seems this version has vanished like a ghost... 👻");
                    log("    We haven't cached this version yet.");
                    log("    If WEAO/Roblox Update Tracker just detected a new version, it may take a few minutes to cache it.");
                    log("    Try again after 1-10 minutes!");
                } else {
                    log(`[!] Failed to fetch rbxPkgManifest: (status: ${resp.status}, err: ${(await resp.text()) || "<failed to get response from server>"})`);
                }
                return;
            }
            manifestBody = await resp.text();
        } catch (error) {
            log(`[!] An error occurred while fetching rbxPkgManifest: ${error.message}`);
            logWarpHint();
            return;
        }

        const useParallel = parallelDownloads !== "false";
        dlPackages(manifestBody, useParallel);
    }
};

async function dlPackages(manifestBody, useParallel = form.parallelDownloads.checked) {
    const _startTime = Date.now();
    const pkgManifestLines = manifestBody.split("\n").map(line => line.trim());

    if (pkgManifestLines[0] !== "v0") {
        log(`[!] Error: unknown rbxPkgManifest format version; expected "v0", got "${pkgManifestLines[0]}"`);
        return;
    }

    if (pkgManifestLines.includes("RobloxApp.zip")) {
        binExtractRoots = extractRoots.player;
        if (binaryType === "WindowsStudio64") {
            log(`[!] Error: BinaryType \`${binaryType}\` given, but "RobloxApp.zip" was found in the manifest!`);
            return;
        }
    } else if (pkgManifestLines.includes("RobloxStudio.zip")) {
        binExtractRoots = extractRoots.studio;
        if (binaryType === "WindowsPlayer") {
            log(`[!] Error: BinaryType \`${binaryType}\` given, but "RobloxStudio.zip" was found in the manifest!`);
            return;
        }
    } else {
        log("[!] Error: Bad/unrecognized rbxPkgManifest, aborting..");
        return;
    }

    log(`[+] Fetching blobs for BinaryType \`${binaryType}\`..`);

    zip = new JSZip();
    zip.file("AppSettings.xml", `<?xml version="1.0" encoding="UTF-8"?>
<Settings>
    <ContentFolder>content</ContentFolder>
    <BaseUrl>http://www.roblox.com</BaseUrl>
</Settings>
`);

    const filesToDownload = pkgManifestLines.filter(l => l.includes(".") && l.endsWith(".zip"));
    log(`[*] Download mode: ${useParallel ? "parallel" : "sequential"}`);

    async function procPkg(packageName, blobData) {
        log(`[+] Received "${packageName}"!`);
        if (!(packageName in binExtractRoots)) {
            log(`[*] Package "${packageName}" not in extraction roots, storing at root.`);
            zip.file(packageName, blobData);
        } else {
            log(`[+] Extracting "${packageName}"...`);
            const extractRootFolder = binExtractRoots[packageName];
            await JSZip.loadAsync(blobData).then(async (packageZip) => {
                blobData = null;
                const fileGetPromises = [];
                packageZip.forEach((path, object) => {
                    if (path.endsWith("\\")) return;
                    const fixedPath = path.replace(/\\/g, "/");
                    fileGetPromises.push(object.async("arraybuffer").then(data => {
                        zip.file(extractRootFolder + fixedPath, data);
                    }));
                });
                await Promise.all(fileGetPromises);
                packageZip = null;
            });
            log(`[+] Extracted "${packageName}"!`);
        }
    }

    if (useParallel) {
        const progressMap = {};
        function syncProgress() {
            let totalLoaded = 0, totalSize = 0;
            for (const key in progressMap) {
                totalLoaded += progressMap[key].loaded;
                totalSize  += progressMap[key].total;
            }
            if (totalSize > 0) {
                const pct = Math.round((totalLoaded / totalSize) * 100);
                setProgress(pct, `Downloading ${filesToDownload.length} packages — ${fmtBytes(totalLoaded)} / ${fmtBytes(totalSize)}`);
            }
        }

        const downloadPromises = filesToDownload.map(packageName => {
            const blobUrl = versionPath + packageName;
            progressMap[blobUrl] = { loaded: 0, total: 0 };
            log(`[+] Fetching "${packageName}"...`);
            return fetchBin(blobUrl, (loaded, total) => {
                progressMap[blobUrl] = { loaded, total };
                syncProgress();
            }).then(blobData => procPkg(packageName, blobData))
              .catch(err => { log(`[!] Error downloading "${packageName}": ${err.message}`); logWarpHint(); throw err; });
        });

        try {
            await Promise.all(downloadPromises);
        } catch {
            log(`[!] One or more packages failed to download, aborting.`);
            return;
        }
    } else {
        let idx = 0;
        for (const packageName of filesToDownload) {
            idx++;
            log(`[+] Fetching "${packageName}" (${idx}/${filesToDownload.length})...`);
            try {
                const blobData = await fetchBin(versionPath + packageName, (loaded, total) => {
                    if (total > 0) setProgress(
                        Math.round((loaded / total) * 100),
                        `Downloading "${packageName}": ${fmtBytes(loaded)} / ${fmtBytes(total)}`
                    );
                });
                await procPkg(packageName, blobData);
            } catch (err) {
                log(`[!] Error downloading "${packageName}": ${err.message}`);
                logWarpHint();
                return;
            }
        }
    }

    // Download launcher if needed
    if (includeLauncher === true && (binaryType === "WindowsPlayer" || binaryType === "WindowsStudio64")) {
        log(`[+] Downloading WEAO RDD Launcher...`);
        setProgress(0, `Starting download for weblauncher.exe...`);
        await new Promise((resolve) => {
            xhrBin("https://curly-shape-1578.vnnaworks.workers.dev/", function(launcherData) {
                log(`[+] Received WEAO RDD Launcher!`);
                zip.file("weblauncher.exe", launcherData);
                resolve();
            }, function(percentage, loaded, total) {
                setProgress(percentage, `Downloading weblauncher.exe: ${fmtBytes(loaded)} / ${fmtBytes(total)}`);
            });
        });
    }

    buildZip();

    function buildZip() {
        const outputFileName = `WEAO-${channel}-${binaryType}-${version}.zip`;
        log();
        if (compressZip) {
            log(`[!] NOTE: Compressing final zip (level ${compressionLevel}/9) — this runs on the main thread and may freeze the page for a while. Most of the content is already zipped so gains are minimal.`);
        }
        log("Thank you for using WEAO RDD! If you have any issues, please report them at our discord server: https://discord.gg/weaoxyz");
        if (includeLauncher && (binaryType === "WindowsPlayer" || binaryType === "WindowsStudio64")) {
            log(`Make sure to open "weblauncher.exe" to be able to launch from Roblox.com! (This is optional, otherwise open "RobloxPlayerBeta.exe")`);
        }
        log(`[+] Exporting assembled zip file "${outputFileName}"..`);
        hideProgress();

        zip.generateAsync({
            type: "arraybuffer",
            compression: compressZip ? "DEFLATE" : "STORE",
            compressionOptions: { level: compressionLevel }
        }, function update(metadata) {
            const percentage = metadata.percent.toFixed(2);
            setProgress(percentage, `Compressing: ${percentage}%`);
        }).then(function(outputZipData) {
            zip = null;
            const elapsed = ((Date.now() - _startTime) / 1000).toFixed(1);
            log(`[+] Done! Completed in ${elapsed}s`);
            hideProgress();
            saveFile(outputFileName, outputZipData);
        });
    }
};


function fmtBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
