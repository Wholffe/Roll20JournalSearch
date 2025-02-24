document.addEventListener("DOMContentLoaded", function() {
    function createSearchBox() {
        const searchBox = document.createElement("input");
        searchBox.type = "text";
        searchBox.id = "journalSearch";
        searchBox.placeholder = "Search for item...";
        
        searchBox.style.width = "100%";
        searchBox.style.padding = "5px";
        searchBox.style.margin = "5px 0";
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
        const journalTab = document.querySelector('li[aria-controls="journal"]');
        const creationControls = document.querySelector("#vm_journal_creation_controls");

        if (journalTab && journalTab.classList.contains("ui-tabs-active") && creationControls) {
            if (document.getElementById("journalSearch")) return;

            const searchBox = createSearchBox();
            creationControls.parentNode.insertBefore(searchBox, creationControls);
            searchBox.addEventListener("keyup", filterEntries);

            console.log("🗿 Added search bar for journal!");
        }
    }

    function observeTabChanges() {
        const tabContainer = document.querySelector(".ui-tabs-nav").parentNode;
        const observer = new MutationObserver(addSearchBox);
        observer.observe(tabContainer, { attributes: true, childList: true, subtree: true });
    }

    observeTabChanges();
    addSearchBox();
});