//Meteor.publish('fixesForCurrentPage', function(url){
//    return Fixes.find({url : url});
//    });

Meteor.publish('fixesForCurrentPage', function(){
    return Fixes.find();
});

Fixes.find().observeChanges({
    added: function(doc){
        doc = Fixes.findOne(doc);
        if (!doc.diffedHTML){
            var diffedHTML = htmldiff(doc.oldHTML, doc.newHTML);
            Fixes.update(doc._id, {$set:{diffedHTML : diffedHTML}});
        }
    }
});

//Fixes.allow({
//    insert: function () {
//        return true;
//    },
//    fetch: function(){
//        return true;
//    }
//});