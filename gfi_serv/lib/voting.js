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

function nayCount(Fix){
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