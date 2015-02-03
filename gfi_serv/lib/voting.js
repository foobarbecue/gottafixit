Meteor.methods({
    toggleVote: function (Fix, voteValue) {
        if (getPreviousVote(Fix, voteValue)){
            removeVote(Fix, voteValue);
        } else {
            addVote(Fix, voteValue);
        }
    }
});

function addVote(Fix, voteValue) {
    var voteSetter = {};
    voteSetter['votes.' + Meteor.userId()] = {
        timestamp: new Date(),
        value: voteValue
    }
    Fixes.update(Fix._id,
        {
            $set : voteSetter
        })
};

function removeVote(Fix, voteValue){
    var voteFinder = {};
    voteFinder['votes.' + Meteor.userId()] = "";
    Fixes.update(Fix._id,{
        $unset: voteFinder
    })
}

function ayeCount(Fix){
    Fixes.find({
        _id: Fix._id,
        "votes.$.value": 1
    }).count()
}

function nayCount(){
    Fixes.find({
        _id: Fix._id,
        "votes.$.value": -1
    }).count()
}

function getPreviousVote(Fix){
    var voteFinder = {}
    voteFinder["votes." + Meteor.userId()] = {$exists:true};
    return Fixes.findOne( voteFinder );
}


//var addVote(item, voteValue){
//};
//
//var removeVote{
//
//};
//
//var hasUpvotedItem = function (item, user) {
//    return item.upvoters && item.upvoters.indexOf(user._id) != -1;
//};
//
//var hasDownvotedItem = function (item, user) {
//    return item.downvoters && item.downvoters.indexOf(user._id) != -1;
//};
//
//function downvoters(value){
//
//}
//
//function upvoters(value){
//
//}