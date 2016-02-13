/*
 * routes.js
 */

Router.configure({
    // Configure every routes layout template
    layoutTemplate: 'applicationLayout'
});

// Landing Page
Router.route('/', function () {
  this.render('editor');
  this.layout('applicationLayout');
});
