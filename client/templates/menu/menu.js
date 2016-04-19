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
            content: " ",
            createdAt: currentDate
        });
    }/*,

    "click .btn-login": function(event){
      Meteor.loginWithGithub({
        requestPermissions: ['user', 'public_repo']
        }, function (err) {
          if (err)
          Session.set('errorMessage', err.reason || 'Unknown error');
          });
    }*/
});

Template.file.events({

    "click": function(event, template) {
        var target = $(event.target);
        if (!target.hasClass( "destroy" )) {
            console.log("sup");
            Session.set('currentDocument', this._id);
            Router.go('editor.selected', {_id: this._id});
        }
    },
    "click .destroy": function(event, template) {

        if (Session.get('currentDocument') == this._id) {

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
