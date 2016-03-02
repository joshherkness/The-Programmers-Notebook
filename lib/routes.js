/*
 * routes.js
 *
 * Configures application routes.
 */

Router.configure({
    // Configure every routes layout template
    //layoutTemplate: 'applicationLayout'
});

// Landing Page
Router.route('/', function() {
    this.render('editor');
    this.layout('applicationLayout');
});

Router.route('/documents/:_id', function() {
    this.render('editor', {
        data: function() {
            return Documents.findOne({
                _id: this.params._id
            });
        }
    });
    this.layout('applicationLayout');
}, {
    name: 'document.show'
});
