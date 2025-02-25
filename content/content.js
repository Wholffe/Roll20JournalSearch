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

function filterEntries() {
    const filter = document.getElementById("journalSearch").value.toLowerCase();
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

function addSearchBox() {
    waitForElement("#vm_journal_creation_controls", (creationControls) => {
        if (!document.getElementById("journalSearch")) {
            const searchBox = createSearchBox();
            creationControls.parentNode.insertBefore(searchBox, creationControls);
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