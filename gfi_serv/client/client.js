Meteor.subscribe('fixesForCurrentPage');

Template.list_of_fixes.helpers({
   fixes:  function(){
       return Fixes.find();
   },
    voted: function(voteVal){
        var previousVote = getPreviousVote(this);
        if (previousVote && previousVote.voteVal == voteVal){
            return "voted"
        }
    },
    voteCount: function(voteVal){return countVotesByVal(this, voteVal)}
});

Template.list_of_fixes.events({
        'click #voteAye': function (evt) {
            if (Meteor.user()) {
                Meteor.call('toggleVote', this, 1)
            } else {
                alert('Sign up or log in.')
            }

        },

        'click #voteNay': function (evt) {
            if (Meteor.user()) {
                Meteor.call('toggleVote', this, -1)
            } else {
                alert('Sign up or log in.')
            }
        }}
);

Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});