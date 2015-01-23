chrome.extension.sendMessage({}, function() {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("Hello. This message was sent from scripts/inject.js");
		// ----------------------------------------------------------
        
	}
	}, 10);
});
chrome.storage.onChanged.addListener(function(changes){
	debugger;
	for (var key in changes){
		var storageChange = changes[key];
		if (key === 'gfi_active') {
			$('p').attr('contenteditable', storageChange.newValue)
		}
	}
});
