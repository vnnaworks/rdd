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
n    * If \`channel\` isn't provided, it will default to "LIVE" (pseudo identifier for
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

const consoleText = document.getElementById("consoleText");
const downloadForm = document.getElementById("downloadForm");
const downloadFormDiv = document.getElementById("downloadFormDiv");
const progressBarContainer = document.getElementById("progressBarContainer");
const progressBar = document.getElementById("progressBar");
const progressMessage = document.getElementById("progressMessage");

function getLinkFromForm() {
    const channelName = downloadForm.channel.value.trim() || downloadForm.channel.placeholder;
    let queryString = `?channel=${encodeURIComponent(channelName)}&binaryType=${encodeURIComponent(downloadForm.binaryType.value)}`;

    const versionHash = downloadForm.version.value.trim();
    if (versionHash !== "") {
        queryString += `&version=${encodeURIComponent(versionHash)}`;
    }

    const compressZip = downloadForm.compressZip.checked;
    const compressionLevel = downloadForm.compressionLevel.value;
    if (compressZip === true) {
        queryString += `&compressZip=true&compressionLevel=${compressionLevel}`;
    }

    const includeLauncher = downloadForm.includeLauncher.checked;
    if (includeLauncher === true) {
        queryString += `&includeLauncher=true`;
    }

    return basePath + queryString;
};

// Called upon the "Download" form button
function downloadFromForm() {
    window.open(getLinkFromForm(), "_blank");
};

// Called upon the "Copy Permanent Link" form button
function copyLinkFromForm() {
    navigator.clipboard.writeText(getLinkFromForm());
};

async function fetchVersionInfo(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

async function downloadLatestVersion() { // Easy button to download the latest version of a binary! 
    const binaryType = downloadForm.binaryType.value;
    const channelName = downloadForm.channel.value.trim() || downloadForm.channel.placeholder;
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
    const compressZip = downloadForm.compressZip.checked;
    const compressionLevel = downloadForm.compressionLevel.value;
    if (compressZip === true) {
        queryString += `&compressZip=true&compressionLevel=${compressionLevel}`;
    }

    const includeLauncher = downloadForm.includeLauncher.checked;
    if (includeLauncher === true) {
        queryString += `&includeLauncher=true`;
    }

    window.open(basePath + queryString, "_blank");

} catch (error) {
    log(`[!] Error fetching latest version: ${error.message}`);
}
}

async function downloadPreviousVersion() { 
    // Helps restart swift users to downgrade to exploit :sob: 
    const binaryType = downloadForm.binaryType.value;
    const channelName = downloadForm.channel.value.trim() || downloadForm.channel.placeholder;
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
        const compressZip = downloadForm.compressZip.checked;
        const compressionLevel = downloadForm.compressionLevel.value;
        if (compressZip === true) {
            queryString += `&compressZip=true&compressionLevel=${compressionLevel}`;
        }

        window.open(basePath + queryString, "_blank");

    } catch (error) {
        log(`[!] Error fetching previous version: ${error.message}`);
    }
}


function scrollToBottom() {
    window.scrollTo({
        top: document.body.scrollHeight
    });
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
    consoleText.append(msg + end);
    if (autoScroll) {
        scrollToBottom();
    }
};

// Function to update the progress bar
function updateProgressBar(percentage, message) {
    progressBarContainer.style.display = 'block';
    progressMessage.style.display = 'block';
    progressBar.style.width = percentage + '%';
    progressBar.innerText = percentage + '%';
    progressMessage.innerText = message;
    scrollToBottom();
}

// Function to hide the progress bar
function hideProgressBar() {
    progressBarContainer.style.display = 'none';
    progressMessage.style.display = 'none';
    progressBar.style.width = '0%';
    progressBar.innerText = '0%';
    progressMessage.innerText = '';
}

// Prompt download
function downloadBinaryFile(fileName, data, mimeType = "application/zip") {
    const blob = new Blob([data], { type: mimeType });

    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;

    let button = document.createElement("button");
    button.innerText = `Redownload ${fileName}`;
    link.appendChild(button);

    document.body.appendChild(link);
    scrollToBottom();

    button.click();
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

function requestBinary(url, callback, progressCallback = null) {
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

let channelPath;
let versionPath;

let binExtractRoots;
let zip;

// Init
main();

function main() {
    if (window.location.search == "") {
        // We won't log anything else; just exit
        downloadFormDiv.hidden = false;
        log(usageMsg, "\n", false);
        return;
    }

    // Query params

    if (channel) {
        if (channel !== "LIVE") {
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
        compressZip = downloadForm.compressZip.checked;
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
        compressionLevel = downloadForm.compressionLevel.value; // Only applies to when `compressZip` is true aswell
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

    if (version) {
        // We're already good to go
        fetchManifest();
    } else {
        const binaryTypeEncoded = escHtml(binaryType);
        const channelNameEncoded = escHtml(channel);

        const clientSettingsUrl = `https://clientsettings.roblox.com/v2/client-version/${binaryTypeEncoded}/channel/${channelNameEncoded}`;
        log("Copy the version hash (the area with \"version-xxxxxxxxxxxxxxxx\" in double-quotes) from the page in the link below (we can't because of CORS), and paste it in the field named \"Version Hash\" in the form above\n");
        consoleText.innerHTML += `<a target="_blank" href="${clientSettingsUrl}">${clientSettingsUrl}</a><br><br><br>`;

        downloadForm.channel.value = channelNameEncoded;
        downloadForm.binaryType.value = binaryTypeEncoded;
        downloadForm.compressZip.checked = compressZip;
        downloadForm.compressionLevel.value = compressionLevel;
        
        // Since we are showing the form, use the checkbox state for display
        downloadForm.includeLauncher.checked = includeLauncher; 

        downloadFormDiv.hidden = false;

        return;
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

        updateProgressBar(0, `Starting download for ${zipFileName}...`);
        requestBinary(versionPath + zipFileName, function (zipData) {
            log("done!");
            log("Thank you for using WEAO RDD! If you have any issues, please report them at our discord server: https://discord.gg/weao");
            hideProgressBar();
            downloadBinaryFile(outputFileName, zipData);
        }, function(percentage, loaded, total) {
            updateProgressBar(percentage, `Downloading ${zipFileName}: ${formatBytes(loaded)} / ${formatBytes(total)}`);
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
            return;
        }

        downloadZipsFromManifest(manifestBody);
    }
};

async function downloadZipsFromManifest(manifestBody) {
    const pkgManifestLines = manifestBody.split("\n").map(line => line.trim());

    if (pkgManifestLines[0] !== "v0") {
        log(`[!] Error: unknown rbxPkgManifest format version; expected "v0", got "${pkgManifestLines[0]}"`); // Should never fail, but bitdancer!
        return
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

    // For both WindowsPlayer and WindowsStudio64
    zip.file("AppSettings.xml", `<?xml version="1.0" encoding="UTF-8"?>
<Settings>
    <ContentFolder>content</ContentFolder>
    <BaseUrl>http://www.roblox.com</BaseUrl>
</Settings>
`);

    let totalBytesToDownload = 0;
    let downloadedBytes = 0;
    const filesToDownload = [];

    // First, let's try to get the total size of all files to download
    // This part requires a HEAD request or a prior knowledge of file sizes.
    // For simplicity, we'll assume we know the file names and will get their sizes on the fly
    // or estimate them later if we can't get accurate sizes beforehand.
    // For now, we'll track the progress of individual files.

    for (const index in pkgManifestLines) {
        const pkgManifestLine = pkgManifestLines[index];
        if (!pkgManifestLine.includes(".")) {
            continue;
        } else if (!pkgManifestLine.endsWith(".zip")) {
            continue;
        }
        filesToDownload.push(pkgManifestLine);
    }

    let filesDownloadedCount = 0;
    let currentTotalDownloadSize = 0; // Total size of all files
    let currentDownloadedSize = 0; // Current downloaded size across all files

    async function downloadNextPackage() {
        if (filesToDownload.length === 0) {
            // All packages have been downloaded
            // Download launcher if needed
            if (
                    // FIX: Check for the boolean value `true`, not the string `"true"`
                    includeLauncher === true &&
                    (binaryType === "WindowsPlayer" || binaryType === "WindowsStudio64")
                    ) {
                log();
                log(`[+] Downloading WEAO RDD Launcher...`);
                updateProgressBar(0, `Starting download for weblauncher.exe...`);
                
                requestBinary("https://curly-shape-1578.vnnaworks.workers.dev/", function(launcherData) {
                    log(`[+] Received WEAO RDD Launcher!`);
                    zip.file("weblauncher.exe", launcherData);
                    exportFinalZip();
                }, function(percentage, loaded, total) {
                    updateProgressBar(percentage, `Downloading weblauncher.exe: ${formatBytes(loaded)} / ${formatBytes(total)}`);
                });
                return;
            }
            
            exportFinalZip();
            return;
        }

        const packageName = filesToDownload.shift(); // Next package
        log(`[+] Fetching "${packageName}"...`);
        const blobUrl = versionPath + packageName;

        requestBinary(blobUrl, async function (blobData) {
            log(`[+] Received package "${packageName}"!`);

            if (packageName in binExtractRoots == false) {
                log(`[*] Package name "${packageName}" not defined in extraction roots for BinaryType \`${binaryType}\`, skipping extraction! (THIS MAY MAKE THE ZIP OUTPUT INCOMPLETE, BE AWARE!)`);
                zip.file(packageName, blobData);
                log(`[+] Moved package "${packageName}" directly to the root folder`);
            } else {
                log(`[+] Extracting "${packageName}"...`);
                const extractRootFolder = binExtractRoots[packageName];

                await JSZip.loadAsync(blobData).then(async function (packageZip) {
                    blobData = null;
                    let fileGetPromises = [];

                    packageZip.forEach(function (path, object) {
                        if (path.endsWith("\\")) {
                            return;
                        }

                        const fixedPath = path.replace(/\\/g, "/");
                        const fileGetPromise = object.async("arraybuffer").then(function (data) {
                            zip.file(extractRootFolder + fixedPath, data);
                        });

                        fileGetPromises.push(fileGetPromise)
                    });

                    await Promise.all(fileGetPromises);
                    packageZip = null;
                });
                log(`[+] Extracted "${packageName}"!`);
            }
            filesDownloadedCount++;
            // Now just continue thx
            downloadNextPackage();

        }, function(percentage, loaded, total) {
            // Update the progress 
            const message = `Workspaceing ${packageName}: ${percentage}% (${formatBytes(loaded)} / ${formatBytes(total)})`;
            updateProgressBar(percentage, message);
        });
    }

    function exportFinalZip() {
        const outputFileName = `WEAO-${channel}-${binaryType}-${version}.zip`;
        log();
        if (compressZip) {
            log(`[!] NOTE: Compressing final zip (with a compression level of ${compressionLevel}/9), this may take a bit longer than with no compression..`);
        }
        log("Thank you for using WEAO RDD! If you have any issues, please report them at our discord server: https://discord.gg/weao");
        if (includeLauncher && (binaryType === "WindowsPlayer" || binaryType === "WindowsStudio64")) {
            log(`Make sure to open "weblauncher.exe" to be able to launch from Roblox.com! (This is optional, otherwise open "RobloxPlayerBeta.exe")`);
        }
        log(`[+] Exporting assembled zip file "${outputFileName}".. `, "");
        hideProgressBar();

        zip.generateAsync({
            type: "arraybuffer",
            compression: compressZip ? "DEFLATE" : "STORE",
            compressionOptions: {
                level: compressionLevel
            }
        }, function update(metadata) {
            const percentage = metadata.percent.toFixed(2);
            updateProgressBar(percentage, `Compressing package: ${percentage}%`);
        }).then(function (outputZipData) {
            zip = null;
            log("done!");
            hideProgressBar();

            downloadBinaryFile(outputFileName, outputZipData);
        });
    }

    downloadNextPackage(); // Start the download process
};


function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
