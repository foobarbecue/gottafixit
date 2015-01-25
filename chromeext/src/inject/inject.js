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

function onFix(){
	// really, we shouldn't do this manually -- it should go through meteor
	// implement that once we have edits loading from the db to pages
	$(this).html(diffString(this.originalText, this.innerText));
	fixes.insert({
		timestamp: new Date(),
		oldHTML: this.originalHTML,
		newHTML: this.innerHTML,
		url: window.location.href
	});
}

// Use the Asteroid library ( https://github.com/mondora/asteroid ) to connect to the server
var ddp_connection = new Asteroid("localhost:3000");

// Use real-time collections
ddp_connection.subscribe("fixesForCurrentPage");
var fixes = ddp_connection.getCollection("fixes");

init();