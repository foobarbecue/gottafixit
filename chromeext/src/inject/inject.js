// initial application of gfi settings
function init(chromeStorageData){
	// Connect to the server using Use the Asteroid library ( https://github.com/mondora/asteroid )
	var ddp_connection = new Asteroid("localhost:3000");
	ddp_connection.subscribe("fixesForCurrentPage");
	var fixesCollection = ddp_connection.getCollection("fixes");

	// Set up fixing

	if (chromeStorageData['fixing_active']) {
		$('p').attr('contenteditable', true)
			.click(saveOriginal)
			.blur(function(){
					onFix(fixesCollection, this)
				});
	}

	//if (chromeStorageData['show_current_user_fixes_active']) {
	//	var fixesForPageQuery = fixesCollection.reactiveQuery({url:window.location.href, user: currentUser});
	//	showFixes(fixesForPageQuery);
	//}

	// Set up display of fixes from database
	if (chromeStorageData['show_user_fixes_active']) {
		//Selector doesn't seem to work, try filter function instead.
		//var fixesForPageQuery = fixesCollection.reactiveQuery({url:window.location.href});
		var url=window.location.href;
		var fixesForPageQuery = fixesCollection.reactiveQuery({});
		console.log(fixesForPageQuery.result);
		showFixes(fixesForPageQuery);
	}

	// TODO after set up accounts
	//if (chromeStorageData['show_current_user_fixes_active']) {
	//	var fixesForPageQuery = fixesCollection.reactiveQuery({url:window.location.href, user: currentUser});
	//	showFixes(fixesForPageQuery);
	//}

}

function saveOriginal() {
	if (!this.originalText) {
		this.originalText = this.innerText;
		this.originalHTML = this.innerHTML;
	}
}

function onFix(fixesCollection, that) {
	// if the user actually changed something
	if (that.originalHTML !== that.innerHTML) {
		// if
		fixesCollection.insert({
			timestamp: new Date(),
			oldHTML: that.originalHTML,
			newHTML: that.innerHTML,
			url: window.location.href,
			nodeSelector: $(that).getSelector()
		});
		// Update the text on the page so the user knows the change has been successful.
		// We are also doing this server-side and really we should use that result instead.
		// Will implement that once we have edits loading from the db to pages.
		//$(this).html(diffString(this.innerText, this.originalText));
	}
}

function showFixes(fixesForPageQuery){
	for (var fix in fixesForPageQuery.result){
		if (fixesForPageQuery.result.hasOwnProperty(fix)) {
			$(fix.nodeSelector).html(fix.diffedHTML);
		}
	}
}

chrome.storage.sync.get(
	// should select keys like this but it doesn't seem to work
	//['fixing_active', 'show_current_user_fixes_active', 'show_all_user_fixes_active'],
	null,
	function(chromeStorageData){
		init(chromeStorageData);
	});

// listen in case checkbox to activate editing in popup is toggled
// TODO arguments passed to init here are probably wrong
//chrome.storage.sync.onChanged.addListener(init);