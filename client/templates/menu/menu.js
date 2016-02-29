// menu.js
Documents = new Mongo.Collection(null);

Template.menu.helpers({
    files: function() {
        // Show newest tasks at the top
        return Documents.find({}, {
            sort: {
                createdAt: -1
            }
        });
    }
})

Template.menu.events({
    "click .btn-create": function(event) {

        event.preventDefault();

        // Get the current date
        var currentDate = new Date();

        // Insert a file into the collection
        Documents.insert({
            title: currentDate.getTime(),
            data: "",
            createdAt: new Date()
        });
    }
});

Template.file.events({

    "click": function() {
        console.log("Hello");
        Session.set('currentDocument', this._id);
    },
    "click .destroy": function() {
        console.log("Remove");
        Documents.remove(this._id);
    }

});

Template.file.helpers({
    isActive: function(){
        return(Session.equals("currentDocument", this._id));
    }
});
