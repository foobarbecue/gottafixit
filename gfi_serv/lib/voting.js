Meteor.methods({
    toggleVote: function (Fix, voteValue) {
        if (alreadyVoted(Fix, voteValue)){
            removeVote(Fix, voteValue);
        } else {
            addVote(Fix, voteValue);
        }
    }
});

function addVote(Fix, voteValue) {
    Fixes.update(Fix,
        {
            $addToSet: {
                'votes': {
                    timestamp: new Date(),
                    voter: Meteor.userId(),
                    value: voteValue
                }
            }
        }
    )
}

function removeVote(Fix, voteValue){
    Fixes.update(Fix,{
        $pull:{
            'votes': {voter: Meteor.userId()}
        }
    })
}

function ayeCount(){

}

function nayCount(){

}

function alreadyVoted(Fix, voteValue){
    var votedFixFinder = Fix;
    votedFixFinder['votes']=[];
    votedFixFinder['votes'].push({voter: Meteor.userId()});
    return Fixes.find(votedFixFinder).count() > 0
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