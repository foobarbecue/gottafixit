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

// initial application of gfi settings
function init(){
	console.log('doing init, innit?');
	chrome.storage.sync.get('gfi_active',
		function(items){
			$('p').attr('contenteditable',items['gfi_active']);
		}
	);
	//	diff stuff
	$('p').click(saveOriginal).blur(onEdit);
}

// listen in case checkbox to activate editing in popup is toggled
chrome.storage.onChanged.addListener(init);

function saveOriginal() {
	if (!this.originalText) {
		this.originalText = this.innerText;
	}
}

function onEdit(){
	$(this).html(diffString(this.originalText, this.innerText));
}

init();