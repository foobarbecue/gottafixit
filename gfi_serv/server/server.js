Meteor.publish('fixes', function(url){
    if (url){
        return Fixes.find({url : url});
    } else {
        return Fixes.find();
    }
});

Meteor.methods({
        submitFix: function (data) {
            data['author'] = Meteor.users.findOne(this.userId);
            if (data['author']) {
                data['diffedHTML'] = htmldiff(data.oldHTML, data.newHTML);
                Fixes.insert(data);
            } else throw new Meteor.Error("not-authorized");
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