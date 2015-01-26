// initial application of gfi settings
function init(){
	chrome.storage.sync.get('gfi_active',
		function(items){
			$('p').attr('contenteditable',items['gfi_active']);
		}
	);
	//	diff stuff
	$('p').click(saveOriginal).blur(onFix);
}

// listen in case checkbox to activate editing in popup is toggled
chrome.storage.onChanged.addListener(init);

function saveOriginal() {
	if (!this.originalText) {
		this.originalText = this.innerText;
		this.originalHTML = this.innerHTML;
	}
}

function onFix() {
	// if the user actually changed something
	if (this.originalHTML !== this.innerHTML) {
		// if
		fixes.insert({
			timestamp: new Date(),
			oldHTML: this.originalHTML,
			newHTML: this.innerHTML,
			url: window.location.href,
			nodeSelector: $(this).getSelector()
		});
		// Update the text on the page so the user knows the change has been successful.
		// We are also doing this server-side and really we should use that result instead.
		// Will implement that once we have edits loading from the db to pages.
		$(this).html(diffString(this.innerText, this.originalText));
	}
}

// Use the Asteroid library ( https://github.com/mondora/asteroid ) to connect to the server
var ddp_connection = new Asteroid("localhost:3000");

ddp_connection.subscribe("fixesForCurrentPage");
var fixes = ddp_connection.getCollection("fixes");

init();