/* unvisitify.js: Unvisitify main file and background service.
 * Called on startup, loads settings from storage and converts desired website
 * links to unvis.it-URLs. Also registers a message listener to update settings
 * when they are outdated. */

/* Array that will contain settings. Settings are loaded upon addon start and
 * when settings are changed. */
let sites = [];

/* Unvisitify the request. Takes a request, then redirects said request to
 * unvis.it.*/
function unvisitify(requestDetails) {
    "use strict";
    return {redirectUrl: "http://unvis.it/" + requestDetails.url};
}

/* Read which sites should be unvisitified from settings. Default are true for
 * all. */
function loadSettingsOrDefault(callback) {
    sites.length = 0;
    chrome.storage.local.get(["un_aftonbladet", "un_expressen"], (results) => {
        if (results.un_aftonbladet || results.un_aftonbladet == null) {
            sites.push("*://*.aftonbladet.se/*");
        }
        if (results.un_expressen || results.un_expressen == null) {
            sites.push("*://*.expressen.se/*");
        }
    return callback();
    });
}

/* Load settings and register listener on addon load. */
loadSettingsOrDefault( () => {
    if (sites.length > 0) {
        chrome.webRequest.onBeforeRequest.addListener(unvisitify, {urls: sites}, ["blocking"]);
    }
});

/* When settings are changed, update the listener to reflect the new settings */
chrome.runtime.onMessage.addListener( (message) => {
    loadSettingsOrDefault( () => {
        chrome.webRequest.onBeforeRequest.removeListener(unvisitify);
        chrome.webRequest.onBeforeRequest.addListener(unvisitify, {urls: sites}, ["blocking"]);
    });
});
