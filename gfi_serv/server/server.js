//Meteor.publish('fixesForCurrentPage', function(url){
//    return Fixes.find({url : url});
//    });

Meteor.publish('fixesForCurrentPage', function(){
    return Fixes.find();
});

Meteor.methods({
        submit_fix: function(data){
            data['author'] = Meteor.users.findOne(this.userId);
            data['diffedHTML'] = htmldiff(data.oldHTML, data.newHTML);
            Fixes.insert(data);
        }
    }
)