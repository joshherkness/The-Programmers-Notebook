/*
 * routes.js
 *
 * Configures application routes.
 */

Router.configure({
    // Configure every routes layout template
    layoutTemplate: 'applicationLayout'
});

// Landing page route.
Router.route('/', function() {
    this.render(undefined);
    this.layout('applicationLayout');
}, {
    name: 'landing'
});

// Editor without selected document route.
Router.route('/editor', function() {
    this.render(undefined);
    this.layout('applicationLayout');
}, {
    name: 'editor.empty'
});

// Editor with selected document route.
Router.route('/editor/:_id', function() {
    this.render('editor');
    this.layout('applicationLayout', {
        data: function() {
            return Documents.findOne({
                _id: this.params._id
            });
        }
    });
}, {
    name: 'editor.selected'
});
