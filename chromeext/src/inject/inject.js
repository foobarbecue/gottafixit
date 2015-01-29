var fixesCollection;
var fixesForPageQuery;
var ddpConnection;
// initial application of gfi settings
function init() {
	// Connect to the server using Use the Asteroid library ( https://github.com/mondora/asteroid )
	ddpConnection = new Asteroid("gottafix.it");
	ddpConnection.subscribe("fixesForCurrentPage");
	fixesCollection = ddpConnection.getCollection("fixes");
	fixesForPageQuery = fixesCollection.reactiveQuery({url:window.location.href});
	// We need this because chrome.storage.onChanged doesn't emit on first load.
	chrome.storage.sync.get(
		// should select keys like this but it doesn't seem to work
		//['fixing_active', 'show_current_user_fixes_active', 'show_all_user_fixes_active'],
		null,
		function(chromeStorageData){
			setup(chromeStorageData);
		});

	chrome.storage.onChanged.addListener(
			function(chromeStorageData){
				setup(storageChangeToStorageObj(chromeStorageData));
			})
}

function setup(chromeStorageData){
	// Apply options from checkboxes etc in browser popup
	if (chromeStorageData['fixing_active'] == true) {
		$('p').toggleClass('gfi_modified')
			.attr('contenteditable', true)
			.click(saveOriginal)
			.blur(function(){
					onFix(fixesCollection, this)
				});
	} else if (chromeStorageData['fixing_active'] == false) {
		// TODO if any p were originally contenteditable=true before gfi got involved, then they've now been damaged.
		// Don't do that, somehow.
		$('p.gfi_modified')
			.attr('contenteditable', false)
			.off("click", "blur")
			.toggleClass('gfi_modified');
	}

	//if (chromeStorageData['show_current_user_fixes_active']) {
	//	var fixesForPageQuery = fixesCollection.reactiveQuery({url:window.location.href, user: currentUser});
	//	showFixes(fixesForPageQuery);
	//}

	// Set up display of fixes from database
	if (chromeStorageData['show_all_fixes_active'] == true) {
		showFixes(fixesForPageQuery.result);
		fixesForPageQuery.on("change", function () {
			showFixes(fixesForPageQuery.result);
		});
	} else if (chromeStorageData['show_all_fixes_active'] == false) {
		hideFixes(fixesForPageQuery.result);
		fixesForPageQuery.on("change", function () {
		});
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
			// TODO  ip address
		});
	}
}

function showFixes(fixesForPageResult){
	$.each(fixesForPageResult, function(index, fix){
		$(fix.nodeSelector).html(fix.diffedHTML);
	});
}

function hideFixes(fixesForPageResult){
	$.each(fixesForPageResult, function(index, fix){
		$(fix.nodeSelector).html(fix.oldHTML);
	});
}

function storageChangeToStorageObj(storageChangeObj){
	// This is an adapter that takes an object in the format passed to the callback of chrome.storage.onChanged and
	// converts it to the format passed to the callback of chrome.storage.sync.get , so that we can call our setup()
	// function both on initial page load and later on if the user clicks checkboxes in the browser popup. I wish it was
	// not needed.
	var storageObj = {};
	for (var change in storageChangeObj) if (storageChangeObj.hasOwnProperty(change)) {
		storageObj[change] = storageChangeObj[change].newValue
	}
	return storageObj;
}

init();