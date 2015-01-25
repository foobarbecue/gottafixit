//Meteor.publish('fixesForCurrentPage', function(url){
//    return Fixes.find({url : url});
//    });

Meteor.publish('fixesForCurrentPage', function(){
    return Fixes.find();
});