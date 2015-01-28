$(function () {
    // Find out if we're active and set the checkboxes to correct value ASAP
    chrome.storage.sync.get(null,
        function(items){
            for (var key in items) {
                if (items.hasOwnProperty(key)){
                    $('#' + key).prop('checked', items[key]);
                }
            }
        }
    );

    // Add handlers for the toggle button to store state in chrome.storage
    $('input').click(
        function () {
            var toStore = {};
            toStore[this.id] = this.checked;
            chrome.storage.sync.set(toStore);
        }
    )
});