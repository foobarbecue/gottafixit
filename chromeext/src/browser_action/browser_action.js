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
    $('input[type=checkbox]').click(
        function () {
            var toStore = {};
            toStore[this.id] = this.checked;
            chrome.storage.sync.set(toStore);
        }
    )


    $('#login').click(
        function(){
            console.log('browser action script sent message')
            chrome.runtime.sendMessage("login")
        }
    )
});