// menu.js

Template.menu.helpers({
    files: function() {
        // Show newest tasks at the top
        return Documents.find({}, {
            sort: {
                createdAt: -1
            }
        });
    }
});

Template.menu.events({
    "click .btn-create": function(event) {
        event.preventDefault();

        // Get the current date
        var currentDate = new Date();

        // Insert a file into the collection
        Documents.insert({
            title: "Untitled",
            content: currentDate.toString(),
            createdAt: currentDate
        });
    }
});

Template.file.events({

    "click": function(event, template) {
        Session.set('currentDocument', this._id);
        Router.go('editor.selected', {_id: this._id});
    },
    "click .destroy": function(event, template) {

        var context = template.data;
        if (context._id == this._id) {
            Session.set('currentDocument', undefined);
            Router.go('editor.empty');
        }
        Documents.remove(this._id);
    }

});

Template.file.helpers({
    isActive: function(){
        return(Session.equals("currentDocument", this._id));
    }
});
