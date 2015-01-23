console.log('loaded browser_action.js')
$(function(){
    console.log('test')
    $('#toggle').click(
        function(event) {
            console.log('clickeeeed')
            var gfi_active = this.checked;
            chrome.storage.sync.set(
                                    {'gfi_active': gfi_active},
                                    function(){
                                        console.log('State set to ' + gfi_active)
                                    });
                                    
        }
    )   
});