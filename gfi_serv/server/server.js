Meteor.publish('fixes', function () {
    return Fixes.find();
});

Meteor.publish('fixesForCurrentPage', function(url){
    return Fixes.find({url : url});
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
);

Fixes.allow({
    insert: function(userId){
        return userId != null
    },
    remove: function (userId, fix) {
        return fix.author._id === userId
    },
    update: function (userId, fix) {
        return fix.author._id === userId
    }
});