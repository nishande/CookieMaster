document.getElementById('export').addEventListener('click', exportCookies);
document.getElementById('import').addEventListener('click', importCookies);

function exportCookies() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        var url = new URL(tabs[0].url);
        chrome.cookies.getAll({ url: url.toString() }, function(cookies) {
            var result = cookies.map(cookie => {
                return {
                    name: cookie.name,
                    value: cookie.value,
                    domain: cookie.domain,
                    path: cookie.path
                };
            });
            var json = JSON.stringify(result);
            navigator.clipboard.writeText(json)
                .then(() => {
                    alert("Exported successfully and cookies copied to clipboard.");
                })
                .catch(error => {
                    console.error('Failed to copy cookies to clipboard:', error);
                    alert("Export failed. Please try again.");
                });
        });
    });
}

function importCookies() {
    var json = prompt("Paste the exported cookies JSON here:");
    if (json) {
        var cookies;
        try {
            cookies = JSON.parse(json);
        } catch (e) {
            alert("Invalid JSON format.");
            return;
        }
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            var url = new URL(tabs[0].url);
            cookies.forEach(cookie => {
                chrome.cookies.set({
                    url: url.toString(),
                    name: cookie.name,
                    value: cookie.value,
                    domain: cookie.domain,
                    path: cookie.path
                });
            });
            alert("Imported successfully.");
        });
    }
}
