function waitForElement(selector, callback, timeout = 10000) {
    const startTime = Date.now();
    const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
            observer.disconnect();
            callback(element);
        } else if (Date.now() - startTime > timeout) {
            observer.disconnect();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

function createSearchBox() {
    const searchBox = document.createElement("input");
    searchBox.type = "text";
    searchBox.id = "journalSearch";
    searchBox.placeholder = "Search for item...";
    searchBox.style.width = "95%";
    searchBox.style.padding = "5px";
    searchBox.style.margin = "5px auto";
    searchBox.style.display = "block";
    searchBox.style.border = "1px solid #ccc";
    searchBox.style.borderRadius = "4px";
    searchBox.style.fontSize = "14px";
    return searchBox;
}

function createModeSwitch() {
    const modeSwitchWrapper = document.createElement("div");
    modeSwitchWrapper.style.margin = "5px 0";

    const label = document.createElement("label");
    label.textContent = "Search by Folder:";
    label.style.marginRight = "10px";

    const modeSwitch = document.createElement("input");
    modeSwitch.type = "checkbox";
    modeSwitch.id = "searchModeSwitch";
    modeSwitch.style.marginRight = "5px";
    
    const modeText = document.createElement("span");
    modeText.id = "modeText";
    modeText.textContent = "Item Search";

    modeSwitch.addEventListener("change", () => toggleSearchMode(modeSwitch.checked));

    modeSwitchWrapper.appendChild(label);
    modeSwitchWrapper.appendChild(modeSwitch);
    modeSwitchWrapper.appendChild(modeText);

    return modeSwitchWrapper;
}

let searchByFolder = false;

function checkFolderMatch(folder, filter) {
    const folderTitle = folder.querySelector(".folder-title").textContent.toLowerCase();
    const subfolders = folder.querySelectorAll(".dd-folder");
    const journalItems = folder.querySelectorAll(".journalitem");

    const isFolderMatch = folderTitle.includes(filter);
    const isSubfolderMatch = Array.from(subfolders).some(subfolder =>
        subfolder.querySelector(".folder-title").textContent.toLowerCase().includes(filter)
    );

    const isItemMatch = Array.from(journalItems).some(item =>
        item.textContent.toLowerCase().includes(filter)
    );

    return isFolderMatch || isSubfolderMatch || isItemMatch;
}

function filterEntries() {
    const filter = document.getElementById("journalSearch").value.toLowerCase();
    const entries = document.querySelectorAll("#journal .content .journalitem");
    const folders = document.querySelectorAll("#journal .content .dd-folder");

    if (searchByFolder) {
        folders.forEach(folder => {
            const title = folder.querySelector(".folder-title").textContent.toLowerCase();
            const subfolders = folder.querySelectorAll(".dd-folder");

            const isVisible = title.includes(filter) || Array.from(subfolders).some(subfolder => subfolder.querySelector(".folder-title").textContent.toLowerCase().includes(filter));
            folder.style.display = isVisible ? "" : "none";

            const folderEntries = folder.querySelectorAll(".journalitem");
            folderEntries.forEach(entry => {
                entry.style.display = isVisible ? "" : "none";
            });
        });
    } else {
        entries.forEach(entry => {
            entry.style.display = entry.textContent.toLowerCase().includes(filter) ? "" : "none";
        });

        folders.forEach(folder => {
            const visibleEntries = folder.querySelectorAll(".journalitem:not([style*='display: none'])");
            folder.style.display = visibleEntries.length > 0 ? "" : "none";
        });
    }
}

function toggleSearchMode(isFolderSearch) {
    searchByFolder = isFolderSearch;
    const searchBox = document.getElementById("journalSearch");
    const modeText = document.getElementById("modeText");

    if (searchByFolder) {
        searchBox.placeholder = "Search for folder...";
        modeText.textContent = "Folder Search";
    } else {
        searchBox.placeholder = "Search for item...";
        modeText.textContent = "Item Search";
    }

    filterEntries();
}

function addSearchBox() {
    waitForElement("#vm_journal_creation_controls", (creationControls) => {
        if (!document.getElementById("journalSearch")) {
            const searchBox = createSearchBox();
            const modeSwitch = createModeSwitch();
            creationControls.parentNode.insertBefore(searchBox, creationControls);
            creationControls.parentNode.insertBefore(modeSwitch, searchBox.nextSibling);
            searchBox.addEventListener("keyup", filterEntries);
        }
    });
}

function observeJournalTab() {
    waitForElement('li[title="Journal"] a[href="#journal"]', (journalTab) => {
        journalTab.addEventListener("click", addSearchBox);
    });
}

function observeDOMChanges() {
    const observer = new MutationObserver(() => addSearchBox());
    observer.observe(document.body, { childList: true, subtree: true });
}

observeJournalTab();
observeDOMChanges();
addSearchBox();