Meteor.subscribe('fixesForCurrentPage');

Template.list_of_fixes.helpers({
   fixes:  function(){
       return Fixes.find();
   }
});

Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});