//Meteor.publish('fixesForCurrentPage', function(url){
//    return Fixes.find({url : url});
//    });

Meteor.publish('fixesForCurrentPage', function () {
    return Fixes.find();
});

Meteor.methods({
        submitFix: function (data) {
            data['author'] = Meteor.users.findOne(this.userId);
            data['diffedHTML'] = htmldiff(data.oldHTML, data.newHTML);
            Fixes.insert(data);
        },
        toggleVote: function (Fix, voteValue) {
            if (getPreviousVote(Fix, voteValue)) {
                removeVote(Fix, voteValue);
            } else {
                addVote(Fix, voteValue);
            }
        }
    }
)