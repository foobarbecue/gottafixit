Meteor.subscribe('fixesForCurrentPage');

Template.list_of_fixes.helpers({
   fixes:  function(){
       return Fixes.find();
   }
});

Template.list_of_fixes.events({
    'click #voteAye' : function(){
        Meteor.call('vote', 'aye', this)
    },
    'click #voteNay' : function(){
        Meteor.call('vote', 'nay', this)
    }
})

Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});