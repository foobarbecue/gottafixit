chrome.extension.sendMessage({}, function() {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("Hello. This message was sent from scripts/inject.js");
		// ----------------------------------------------------------
        debugger;
	}
	}, 10);
});
chrome.storage.onChanged.addListener(function(changes) {
		if (changes.hasOwnProperty('gfi_active')){
			$('p').attr('contenteditable', changes.gfi_active.newValue);
		}
});
