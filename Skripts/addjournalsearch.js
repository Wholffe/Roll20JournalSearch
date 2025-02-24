function addJournalSearch() {
    let tabNav = document.querySelector(".ui-tabs-nav");
    let journalTab = document.querySelector('li[aria-controls="journal"]');
    let journalContent = document.querySelector("#journal");
    let creationControls = document.querySelector("#vm_journal_creation_controls");

    if (journalTab && journalTab.classList.contains("ui-tabs-active") && journalContent && creationControls) {
        if (document.getElementById("journalSearch")) return;

        let searchBox = document.createElement("input");
        searchBox.type = "text";
        searchBox.id = "journalSearch";
        searchBox.placeholder = "Search for item...";
        searchBox.style = "width: 100%; padding: 5px; margin: 5px 0; display: block;";

        creationControls.parentNode.insertBefore(searchBox, creationControls);

        searchBox.addEventListener("keyup", function() {
            let filter = this.value.toLowerCase();
            let entries = document.querySelectorAll("#journal .content .journalitem");

            entries.forEach(entry => {
                let text = entry.textContent.toLowerCase();
                entry.style.display = text.includes(filter) ? "" : "none";
            });
        });

        console.log("🗿 Added search bar for journal!");
    }
}

let observer = new MutationObserver(addJournalSearch);
observer.observe(document.querySelector(".ui-tabs-nav").parentNode, { attributes: true, childList: true, subtree: true });

addJournalSearch();