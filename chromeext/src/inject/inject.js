var fixesCollection;
var fixesForPageQuery;
var gfi_server = "gottafix.it";
//var ddpConnection;
// initial application of gfi settings
function init() {
	// Connect to the server using Use the Asteroid library ( https://github.com/mondora/asteroid )
	ddpConnection = new Asteroid(gfi_server);
	ddpConnection.subscribe("fixes", window.location.href);
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
			});

	ddpConnection.on("login",function(){console.log('logged in')});

}

function setup(chromeStorageData){
	// Apply options from checkboxes etc in browser popup
	if (chromeStorageData['fixing_active'] == true) {
		$('p').toggleClass('gfi_modified')
			.attr('contenteditable', true)
			.click(saveOriginal)
			.blur(function(){
					onFix(this)
				});
	} else if (chromeStorageData['fixing_active'] == false) {
		// TODO if any p were originally contenteditable=true before gfi got involved, then they've now been damaged.
		// Don't do that, somehow.
		$('p.gfi_modified')
			.attr('contenteditable', false)
			.off("click", "blur")
			.toggleClass('gfi_modified');
	}

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

function onFix(that) {

	// if the user actually changed something
	if (that.originalHTML !== that.innerHTML) {
		ddpConnection.call('submitFix',{
			timestamp: new Date(),
			oldHTML: that.originalHTML,
			newHTML: that.innerHTML,
			url: window.location.href,
			nodeSelector: $(that).getSelector()
		});
	}
}

function showFixes(fixesForPageResult) {
	$.each(fixesForPageResult, function (index, fix) {
		$(fix.nodeSelector)
			.html(fix.diffedHTML)
			.append(
			"<div class='fixed_icon'>" +
			"<a href='http://" +
			gfi_server + "#" + fix._id + "'>" +
			"<img src='"+
			chrome.extension.getURL('/icons/icon19.png') +
			"'><span class='author'>paragrah fixed by " + fix.author.profile.name +
			"</span></a></div>");
	});
	$('.fixed_icon').hover(function () {
		$(this).find('span')
			.toggle()
			.parent('p').toggleClass('highlight_fixes')
	});
	// Setting parent element to position: relative is a little risky... will break page layout in some edge cases
	// TODO find a better way to position the fixed_icon
	$('.fixed_icon').parent().css({position: 'relative'});
	$('.fixed_icon span').hide();
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