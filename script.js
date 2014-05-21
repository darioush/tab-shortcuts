var DL_URL = "chrome://downloads/";

function change_tab(next_prev) {
    chrome.tabs.query({currentWindow: true, active: true},  function(tabs) {
        for (i in tabs) {
            var tab = tabs[i];
            chrome.tabs.query({windowId:tab.windowId}, function(alltabs) {
                chrome.tabs.query({index: (next_prev(tab.index) + alltabs.length) % alltabs.length,
                                    windowId:tab.windowId}, function(tabs) {
                    for (i in tabs) {
                        chrome.tabs.update(tabs[i].id, {active:true});
                    }
                });
            });
        }
    });
}

function open_downloads() {
    chrome.tabs.query({currentWindow: true, url: DL_URL}, function (tabs) {
        var done = false;
        for (i in tabs) {
            chrome.tabs.update(tabs[i].id, {active:true});
            done = true;
        }
        // if there is no existing downloads tab
        if (done == false) {
            chrome.tabs.create({url: DL_URL});
        }
    });
}

chrome.commands.onCommand.addListener(function(command) {
    if (command == 'next-tab') {
        change_tab(function(x) { return x + 1 });
    }
    if (command == 'prev-tab') {
        change_tab(function(x) { return x - 1 });
    }
    if (command == 'remap-downloads') {
        open_downloads();
    }
});
