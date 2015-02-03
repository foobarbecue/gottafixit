addVote = function(fix, voteVal) {
    var voteSetter = {};
    voteSetter['votes.' + Meteor.userId()] = {
        timestamp: new Date(),
        voteVal: voteVal
    }
    Fixes.update(fix._id,
        {
            $set : voteSetter
        })
};

removeVote = function(fix, voteVal){
    //Server side
    var voteFinder = {};
    voteFinder['votes.' + Meteor.userId()] = "";
    Fixes.update(fix._id,{
        $unset: voteFinder
    })
}

countVotesByVal = function(fix, voteVal){
    // Lame. Should be using $sum but there isn't a way with my current schema.
    var sum = 0;
    for (var vote in fix.votes){
        var thisVoteVal = fix.votes[vote].voteVal;
        if (thisVoteVal == voteVal){
            sum+=thisVoteVal;
        }
    }
    return Math.abs(sum);
}

getPreviousVote = function (fix){
    return fix.votes[Meteor.userId()];
}