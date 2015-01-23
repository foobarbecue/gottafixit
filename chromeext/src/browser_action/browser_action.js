$(function () {
    // Find out if we're active and set the checkbox to correct value ASAP
    chrome.storage.sync.get('gfi_active',
        function(items){
            $('#toggle').prop('checked',items['gfi_active']);
        }
    );

    // Add click handler for the toggle button to store state in chrome.storage
    $('#toggle').click(
        function () {
            chrome.storage.sync.set(
                {'gfi_active': this.checked}
            )
        }
    )
});