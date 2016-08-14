/* settings.js: Unvisitify settings file. Handles reading settings from HTML
 * form, saving settings to storage and messaging the background service to
 * update settings when they have been outdated. */

/* Save the settings to local storage. */
function setSettings() {
    "use strict";
    var aftonbladet_checked = document.querySelector("#un_aftonbladet").checked;
    var expressen_checked = document.querySelector("#un_expressen").checked;
    chrome.storage.local.set({
        un_aftonbladet: aftonbladet_checked,
        un_expressen: expressen_checked
    });
    var sites = [aftonbladet_checked, expressen_checked];
    /* Settings are now outdated, update listeners*/
    chrome.runtime.sendMessage();
}

/* Load the settings from storage. Defaults to true if no setting exists. */
function getSettingsOrSetDefault() {
    "use strict";
    chrome.storage.local.get(["un_aftonbladet", "un_expressen"], (results) => {
        document.querySelector("#un_aftonbladet").checked = results.un_aftonbladet != null ? results.un_aftonbladet : true;
        document.querySelector("#un_expressen").checked = results.un_expressen != null ? results.un_aftonbladet : true;
    });
}

/* Save when button is clicked */
document.addEventListener("DOMContentLoaded", getSettingsOrSetDefault);
/* Load settings from storage when settings page is opened */
document.querySelector("form").addEventListener("submit", setSettings);
