HTMLViewController.loadLocalizedStrings();

var descriptionOfHowToChangePermissions;

window.addEventListener("DOMContentLoaded", async () => {
    document.documentElement.dir = HTMLViewController.UIString("Text Direction");
    descriptionOfHowToChangePermissions = await webkit.messageHandlers.controller.postMessage("descriptionOfHowToChangePermissions");
});

window.addEventListener("load", () => {
    HTMLViewController.pageLoaded();
    webkit.messageHandlers.controller.postMessage("loaded");
});

function editWebsitesButtonClicked()
{
    webkit.messageHandlers.controller.postMessage("editWebsites");
}

function allowAllWebsitesButtonClicked()
{
    webkit.messageHandlers.controller.postMessage("allowAllWebsites");
}

async function developMenuEnabled()
{
    return webkit.messageHandlers.controller.postMessage("developMenuEnabled");
}

async function displayPermissionsAndErrors(websiteAccess, errorStrings, displayName, enabled)
{
    await displayPermissions(websiteAccess, displayName, enabled);
    await displayErrors(errorStrings, displayName);
}

async function displayPermissions(websiteAccess, displayName, enabled)
{
    if (typeof displayPermissionsExtras === "function")
        await displayPermissionsExtras(websiteAccess, displayName, enabled);

    var overridePageSection = document.getElementById("overridePage");
    const isOverridePageRequested = websiteAccess ? websiteAccess["Override Page"] : false;
    if (isOverridePageRequested)
        overridePage.classList.remove("hidden");
    else
        overridePage.classList.add("hidden");

    const webpageContentsSection = document.getElementById("webpageContents");
    const browsingHistorySection = document.getElementById("browsingHistory");
    const trackingInformationSection = document.getElementById("trackingInformation");

    const websiteAccessTitle = document.getElementById("websiteAccessTitle");
    websiteAccessTitle.textContent = "";

    const websiteAccessSection = document.getElementById("websiteAccess");

    if (!websiteAccess) {
        websiteAccessSection.classList.add("hidden");
        return;
    }

    websiteAccessSection.classList.remove("hidden");
    browsingHistorySection.classList.remove("hidden");

    const webpageContentsSubtitle = webpageContentsSection.querySelector(".accessSubtitle");
    webpageContentsSubtitle.textContent = HTMLViewController.UIString("Can read sensitive information from webpages, including passwords, phone numbers, and credit cards. Can alter the appearance and behavior of webpages. This applies on:");

    const browsingHistorySubtitle = browsingHistorySection.querySelector(".accessSubtitle");
    browsingHistorySubtitle.textContent = HTMLViewController.UIString("Can see when you visit:");

    const trackingInformationSubtitle = trackingInformationSection.querySelector(".accessSubtitle");
    trackingInformationSubtitle.textContent = HTMLViewController.UIString("Can send information to webpages you visit, which can be used to track you across:");

    const accessLevel = websiteAccess["Level"];
    if (accessLevel === "All" || accessLevel === "Some") {
        websiteAccessTitle.textContent = HTMLViewController.UIString("Permissions:");

        const webpageContentsDomainList = document.getElementById("webpageContentsDomainList");
        const browsingHistoryDomainList = document.getElementById("browsingHistoryDomainList");

        webpageContentsDomainList.innerHTML = "";
        browsingHistoryDomainList.innerHTML = "";

        if (accessLevel === "All") {
            webpageContentsDomainList.classList.add("hidden");
            browsingHistoryDomainList.classList.add("hidden");

            webpageContentsSubtitle.innerHTML = HTMLViewController.UIString("Can read sensitive information from webpages, including passwords, phone numbers, and credit cards. Can alter the appearance and behavior of webpages. This applies on <em>all webpages</em>.");
            browsingHistorySubtitle.innerHTML = HTMLViewController.UIString("Can see when you visit <em>all webpages</em>.");
        } else {
            const allowedDomains = websiteAccess["Allowed Domains"];

            if (allowedDomains.length == 1) {
                webpageContentsDomainList.classList.add("hidden");
                browsingHistoryDomainList.classList.add("hidden");

                webpageContentsSubtitle.innerHTML = HTMLViewController.UIString("Can read sensitive information from webpages, including passwords, phone numbers, and credit cards. Can alter the appearance and behavior of webpages. This applies on <em>%@</em>.").format(allowedDomains[0]);
                browsingHistorySubtitle.innerHTML = HTMLViewController.UIString("Can see when you visit <em>%@</em>.").format(allowedDomains[0]);
            } else {
                webpageContentsDomainList.classList.remove("hidden");
                browsingHistoryDomainList.classList.remove("hidden");

                for (let allowedDomain of allowedDomains) {
                    let allowedDomainListItem = document.createElement("li");
                    allowedDomainListItem.textContent = allowedDomain;

                    webpageContentsDomainList.appendChild(allowedDomainListItem.cloneNode(true));
                    browsingHistoryDomainList.appendChild(allowedDomainListItem.cloneNode(true));
                }
            }
        }

        if (websiteAccess["Has Injected Content"])
            webpageContentsSection.classList.remove("hidden");
        else
            webpageContentsSection.classList.add("hidden");

        const allowedDomainsForHeaderInjection = websiteAccess["Allowed Domains for Header Injection"];
        if (allowedDomainsForHeaderInjection) {
            trackingInformationSection.classList.remove("hidden");

            const trackingInformationDomainList = document.getElementById("trackingInformationDomainList");
            trackingInformationDomainList.innerHTML = "";

            if (allowedDomainsForHeaderInjection.length == 1) {
                trackingInformationDomainList.classList.add("hidden");

                trackingInformationSubtitle.innerHTML = HTMLViewController.UIString("Can send information to webpages you visit, which can be used to track you across <em>%@</em>.").format(allowedDomainsForHeaderInjection[0]);
            } else {
                trackingInformationDomainList.classList.remove("hidden");

                for (let allowedDomain of allowedDomainsForHeaderInjection) {
                    let allowedDomainListItem = document.createElement("li");
                    allowedDomainListItem.textContent = allowedDomain;
                    trackingInformationDomainList.appendChild(allowedDomainListItem);
                }
            }
        } else
            trackingInformationSection.classList.add("hidden");
    } else if (accessLevel === "Discrete") {
        webpageContentsSection.classList.add("hidden");
        trackingInformationSection.classList.add("hidden");
        browsingHistorySection.classList.add("hidden");

        const requestedAccessToCurrentSite = websiteAccess["Requested Current Site"];
        const requestedSiteAccess = websiteAccess["Requested Sites"];
        const configuredSiteAccess = websiteAccess["Configured Sites"];
        const hasInjectedContent = websiteAccess["Has Injected Content"];

        const requestsTracking = websiteAccess["Requests Tracking"];

        const addBlankLine = (element) => {
            element.appendChild(document.createElement("br"));
            element.appendChild(document.createElement("br"));
        };

        const hasNoAccess = !requestedAccessToCurrentSite && configuredSiteAccess === "None";
        websiteAccessTitle.textContent = HTMLViewController.UIString("Permissions:");

        let accessCategory;

        if (configuredSiteAccess === "All") {
            accessCategory = websiteAccessTitle;

            addBlankLine(websiteAccessTitle);

            const warningElement = document.createElement("div");
            warningElement.className = "warningBanner";

            const warningContents = document.createElement("div");

            const headerElement = document.createElement("h1");

            if (hasInjectedContent)
                headerElement.textContent = HTMLViewController.UIString("This extension can read and alter webpages you visit and see your browsing history on all websites.");
            else if (requestsTracking)
                headerElement.textContent = HTMLViewController.UIString("This extension can see your browsing history and send information to all websites you visit.");
            else
                headerElement.textContent = HTMLViewController.UIString("This extension can see your browsing history on all websites you visit.");

            warningContents.appendChild(headerElement);

            if (hasInjectedContent) {
                const warningBodyTextNode = document.createTextNode(HTMLViewController.UIString("This includes sensitive information from webpages, including passwords, phone numbers, and credit cards."));
                warningContents.appendChild(warningBodyTextNode);
            }
            else if (requestsTracking) {
                const warningBodyTextNode = document.createTextNode(HTMLViewController.UIString("This information can be used to track you across all webpages."));
                warningContents.appendChild(warningBodyTextNode);
            }

            warningElement.appendChild(warningContents);
            websiteAccessTitle.appendChild(warningElement);

            websiteAccessTitle.appendChild(document.createTextNode(descriptionOfHowToChangePermissions));
            websiteAccessTitle.appendChild(document.createElement("br"));
        } else if (!hasNoAccess) {
            accessCategory = document.createElement("div");
            accessCategory.classList.add("accessCategory");

            const accessTitle = document.createElement("div");
            accessTitle.classList.add("accessTitle");

            if (hasInjectedContent)
                accessTitle.textContent = HTMLViewController.UIString("Webpage Contents and Browsing History");
            else if (requestsTracking)
                accessTitle.textContent = HTMLViewController.UIString("Browsing History and Tracking Information");
            else
                accessTitle.textContent = HTMLViewController.UIString("Browsing History");

            accessCategory.appendChild(accessTitle);

            const requestsMultiplePermissions = configuredSiteAccess instanceof Array && ((requestedAccessToCurrentSite && configuredSiteAccess.length >= 1) || configuredSiteAccess.length >= 2);

            const accessSubtitle = document.createElement("div");
            accessSubtitle.classList.add("accessSubtitle");
            accessSubtitle.id = "webpageContentsAndBrowsingHistorySubtitle";
            accessCategory.appendChild(accessSubtitle);

            if (requestsMultiplePermissions) {
                if (hasInjectedContent)
                    accessSubtitle.textContent = HTMLViewController.UIString("Can read and alter sensitive information on webpages, including passwords, phone numbers, and credit cards, and see your browsing history on:");
                else if (requestsTracking)
                    accessSubtitle.textContent = HTMLViewController.UIString("Can see your browsing history and send information to webpages you visit, which can be used to track you across:");
                else
                    accessSubtitle.textContent = HTMLViewController.UIString("Can see your browsing history on:");

                const sitesList = document.createElement("ul");
                if (requestedAccessToCurrentSite) {
                    let listItem = document.createElement("li");
                    listItem.appendChild(document.createTextNode(HTMLViewController.UIString("the current tab’s webpage when you use the extension")));
                    sitesList.appendChild(listItem);
                }

                if (configuredSiteAccess instanceof Array) {
                    for (let configuredSite of configuredSiteAccess) {
                        let listItem = document.createElement("li");
                        listItem.textContent = configuredSite;
                        sitesList.appendChild(listItem);
                    }
                }

                accessCategory.appendChild(sitesList);
            } else {
                if (requestedAccessToCurrentSite) {
                    if (hasInjectedContent)
                        accessSubtitle.innerHTML = HTMLViewController.UIString("Can read and alter sensitive information on webpages, including passwords, phone numbers, and credit cards, and see your browsing history on <em>the current tab’s webpage when you use the extension</em>.");
                    else if (requestsTracking)
                        accessSubtitle.innerHTML = HTMLViewController.UIString("Can see your browsing history and send information to webpages you visit, which can be used to track you on <em>the current tab’s webpage when you use the extension</em>.");
                    else
                        accessSubtitle.innerHTML = HTMLViewController.UIString("Can see your browsing history on <em>the current tab’s webpage when you use the extension</em>.");
                } else if (configuredSiteAccess instanceof Array) {
                    if (hasInjectedContent)
                        accessSubtitle.innerHTML = HTMLViewController.UIString("Can read and alter sensitive information on webpages, including passwords, phone numbers, and credit cards, and see your browsing history on <em>%@</em>.").format(configuredSiteAccess[0]);
                    else if (requestsTracking)
                        accessSubtitle.innerHTML = HTMLViewController.UIString("Can see your browsing history and send information to webpages you visit, which can be used to track you on <em>%@</em>.").format(configuredSiteAccess[0]);
                    else
                        accessSubtitle.innerHTML = accessSubtitle.innerHTML = HTMLViewController.UIString("Can see your browsing history on <em>%@</em>.").format(configuredSiteAccess[0]);
                }
            }

            websiteAccessTitle.appendChild(accessCategory);
        } else {
            accessCategory = document.createElement("div");
            accessCategory.classList.add("accessCategory");

            const accessTitle = document.createElement("div");
            accessTitle.classList.add("accessTitle");

            if (hasInjectedContent)
                accessTitle.textContent = HTMLViewController.UIString("Webpage Contents and Browsing History");
            else if (requestsTracking)
                accessTitle.textContent = HTMLViewController.UIString("Browsing History and Tracking Information");
            else
                accessTitle.textContent = HTMLViewController.UIString("Browsing History");

            accessCategory.appendChild(accessTitle);

            const accessSubtitle = document.createElement("div");
            accessSubtitle.classList.add("accessSubtitle");
            accessSubtitle.id = "webpageContentsAndBrowsingHistorySubtitle";
            accessCategory.appendChild(accessSubtitle);


            if (hasInjectedContent)
                accessSubtitle.appendChild(document.createTextNode(HTMLViewController.UIString("When you use the “%@” toolbar button, the extension may request access to read and alter webpages and to see your browsing history. Granting access may be required for the extension to function.").format(displayName)));
            else if (requestsTracking)
                accessSubtitle.appendChild(document.createTextNode(HTMLViewController.UIString("When you use the “%@” toolbar button, the extension may request access to see your browsing history and send information to webpages you visit, which can be used to track you. Granting access may be required for the extension to function.").format(displayName)));
            else
                accessSubtitle.appendChild(document.createTextNode(HTMLViewController.UIString("When you use the “%@” toolbar button, the extension may request access to see your browsing history. Granting access may be required for the extension to function.").format(displayName)));

            addBlankLine(accessSubtitle);
            accessSubtitle.appendChild(document.createTextNode(HTMLViewController.UIString("You have not allowed this extension on any websites yet.")));

            websiteAccessTitle.appendChild(accessCategory);
        }

        if (requestedSiteAccess !== "None") {
            const editWebsitesButton = document.createElement("button");
            editWebsitesButton.addEventListener("click", editWebsitesButtonClicked, false);
            editWebsitesButton.textContent = HTMLViewController.UIString("Edit Websites…");
            editWebsitesButton.disabled = !isEnabledInAnyProfile(websiteAccess, enabled);

            accessCategory.appendChild(document.createElement("br"));
            accessCategory.appendChild(editWebsitesButton);
        }

        if (requestedSiteAccess === "All" && configuredSiteAccess !== "All") {
            const allowAllWebsitesButton = document.createElement("button");
            allowAllWebsitesButton.addEventListener("click", allowAllWebsitesButtonClicked, false);
            allowAllWebsitesButton.textContent = HTMLViewController.UIString("Always Allow on Every Website…");
            allowAllWebsitesButton.disabled = !isEnabledInAnyProfile(websiteAccess, enabled);

            accessCategory.appendChild(allowAllWebsitesButton);
        }
    } else {
        browsingHistorySection.classList.add("hidden");
        webpageContentsSection.classList.add("hidden");
        trackingInformationSection.classList.add("hidden");

        if (accessLevel === "NoneForContentBlocker")
            websiteAccessTitle.textContent = HTMLViewController.UIString("“%@” does not have permission to read or transmit content from any webpages.").format(displayName);
        else {
            if (websiteAccess["Override Page"])
                websiteAccessTitle.textContent = HTMLViewController.UIString("Permissions:");
            else
                websiteAccessTitle.textContent = HTMLViewController.UIString("“%@” does not have permission to read, alter, or transmit content from any webpages.").format(displayName);
        }
    }
}

async function displayErrors(errorStrings, displayName)
{
    const errorSection = document.getElementById("errors");

    if (!errorStrings || !errorStrings.length) {
        errorSection.classList.add("hidden");
        return;
    }

    errorSection.classList.remove("hidden");

    if (!await developMenuEnabled()) {
        // Show something if the website access section is hidden, otherwise the pane will be empty.
        const websiteAccessSection = document.getElementById("websiteAccess");
        if (websiteAccessSection.classList.contains("hidden"))
            errorSection.textContent = HTMLViewController.UIString("“%@” is not supported by this version of Safari.").format(displayName);
        return;
    }

    errorSection.textContent = "";
    const errorHeader = document.createElement("div");
    errorHeader.textContent = HTMLViewController.UIString("Errors for “%@”:").format(displayName);
    errorSection.appendChild(errorHeader);

    const errorList = document.createElement("ul");

    const formatError = (string) => {
        const mapping = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;"
        };

        return string.replace(/[&<>]/g, (match) => { return mapping[match] || match }).replace(/`(.*?)`/g, "<code>$1</code>");
    };

    for (let errorString of errorStrings) {
        let errorItem = document.createElement("li");
        errorItem.innerHTML = formatError(errorString);
        errorList.appendChild(errorItem);
    }

    errorSection.appendChild(errorList);
}


function privateBrowsingCheckboxClicked()
{
    const checkboxElement = document.getElementById("private-browsing-checkbox");
    const message = checkboxElement.checked ? "allowPrivateBrowsing" : "disallowPrivateBrowsing";
    webkit.messageHandlers.controller.postMessage(message);
}


function manageProfilesButtonClicked()
{
    webkit.messageHandlers.controller.postMessage("manageProfiles");
}

function isEnabledInAnyProfile(websiteAccess, enabled)
{
    return enabled || websiteAccess?.["Enabled Profiles"]?.length > 0;
}

async function displayPermissionsExtras(websiteAccess, displayName, enabled)
{
    const enabledProfiles = websiteAccess?.["Enabled Profiles"] || null;



    var privateSectionHidden = !enabled;

    const privateSection = document.getElementById("privateAccess");
    privateSection.classList.toggle("hidden", privateSectionHidden);

    const checkboxElement = document.getElementById("private-browsing-checkbox");
    const isPrivateBrowsingAllowed = websiteAccess?.["Private Browsing"] || false;
    checkboxElement.checked = isPrivateBrowsingAllowed;


    checkboxElement.addEventListener("click", privateBrowsingCheckboxClicked, false);


    const profilesSection = document.getElementById("profileAccess");

    if (enabledProfiles instanceof Array) {
        profilesSection.classList.remove("hidden");

        const manageProfilesButton = profilesSection.querySelector("button");
        manageProfilesButton.addEventListener("click", manageProfilesButtonClicked, false);

        const accessSubtitle = profilesSection.querySelector(".accessSubtitle");
        if (!enabledProfiles.length)
            accessSubtitle.innerHTML = HTMLViewController.UIString("“%@” is not active in any profiles.").format(displayName);
        else if (enabledProfiles.length === 1) {
            let message = ["extensionIsActiveInProfile", displayName, enabledProfiles[0]];
            accessSubtitle.innerHTML = await webkit.messageHandlers.controller.postMessage(message);
        } else {
            let profileString = "";
            for (let i = 0; i < enabledProfiles.length; ++i) {
                let profileName = enabledProfiles[i];
                if (i && i < enabledProfiles.length - 1)
                    profileString += HTMLViewController.UIString(", ");
                else if (i && enabledProfiles.length === 2)
                    profileString += HTMLViewController.UIString(" and ");
                else if (i)
                    profileString += HTMLViewController.UIString(", and ");
                profileString += HTMLViewController.UIString("<em>%@</em>").format(profileName);
            }

            let message = ["extensionIsActiveInProfiles", displayName, profileString];
            accessSubtitle.innerHTML = await webkit.messageHandlers.controller.postMessage(message);
        }

    } else
        profilesSection.classList.add("hidden");


}
