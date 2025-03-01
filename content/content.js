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
    modeSwitchWrapper.style.marginLeft = "10px";

    const label = document.createElement("label");
    label.style.marginRight = "10px";

    const modeSwitch = document.createElement("input");
    modeSwitch.type = "checkbox";
    modeSwitch.id = "searchModeSwitch";
    modeSwitch.style.marginRight = "5px";
    
    const modeText = document.createElement("span");
    modeText.id = "modeText";

    modeSwitch.addEventListener("change", () => toggleSearchMode(modeSwitch.checked));

    modeSwitchWrapper.appendChild(label);
    modeSwitchWrapper.appendChild(modeSwitch);
    modeSwitchWrapper.appendChild(modeText);

    return modeSwitchWrapper;
}

let searchByFolder = false;

function searchFolders(filter) {
    const folders = document.querySelectorAll("#journal .content .dd-folder");

    folders.forEach(folder => {
        const titleElement = folder.querySelector(".folder-title");
        if (!titleElement) return;

        const title = titleElement.textContent.toLowerCase();

        if (title.includes(filter)) {
            console.log(`found folder: ${titleElement.textContent}`);
            folder.style.display = "";
            printSubfoldersAndItems(folder, "  ");
            showParentFolder(folder);
        }
    });
}

function showParentFolder(folder) {
    let parentFolder = folder.parentElement.closest(".dd-folder");
    while (parentFolder) {
        parentFolder.style.display = "";
        parentFolder = parentFolder.parentElement.closest(".dd-folder");
    }
}

function printSubfoldersAndItems(folder, indent) {
    const subfolders = folder.querySelectorAll(":scope > .dd-list > .dd-folder");

    subfolders.forEach(subfolder => {
        const subfolderTitle = subfolder.querySelector(".folder-title");
        if (subfolderTitle) {
            console.log(`${indent}├─ folder: ${subfolderTitle.textContent}`);
            subfolder.style.display = "";
            printSubfoldersAndItems(subfolder, indent + "  ");
        }
    });

    const items = folder.querySelectorAll(":scope > .dd-list > .journalitem");

    items.forEach(item => {
        const itemTitle = item.querySelector(".namecontainer");
        if (itemTitle) {
            console.log(`${indent}└─ Item: ${itemTitle.textContent}`);
            item.style.display = "";
        }
    });
}

function searchEntries(filter) {
    const entries = document.querySelectorAll("#journal .content .journalitem");
    const folders = document.querySelectorAll("#journal .content .dd-folder");

    entries.forEach(entry => {
        entry.style.display = entry.textContent.toLowerCase().includes(filter) ? "" : "none";
    });

    folders.forEach(folder => {
        const visibleEntries = folder.querySelectorAll(".journalitem:not([style*='display: none'])");
        folder.style.display = visibleEntries.length > 0 ? "" : "none";
    });
}

function filterEntries() {
    const filter = document.getElementById("journalSearch").value.toLowerCase();
    
    if (searchByFolder) {
        searchEntries(filter);
        searchFolders(filter);
    } else {
        searchEntries(filter);
    }
}

function toggleSearchMode(isFolderSearch) {
    searchByFolder = isFolderSearch;
    const searchBox = document.getElementById("journalSearch");

    if (searchByFolder) {
        searchBox.placeholder = "Search for folder...";
    } else {
        searchBox.placeholder = "Search for item...";
    }

    filterEntries();
}

function addSearchBox() {
    waitForElement("#vm_journal_creation_controls", (creationControls) => {
        if (!document.getElementById("journalSearch")) {
            const searchBox = createSearchBox();
            const modeSwitch = createModeSwitch();
            const container = document.createElement("div");
            container.style.display = "flex";
            container.style.alignItems = "center";
            container.appendChild(searchBox);
            container.appendChild(modeSwitch);
            creationControls.parentNode.insertBefore(container, creationControls);
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