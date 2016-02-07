/*
 * routes.js
 */

Router.configure({
    // Configure every routes layout template
    layoutTemplate: 'mainLayout'
});

// Landing Page
Router.route('/', function () {
  this.render('landingPage');
  this.layout('mainLayout');
});

// Markdown editor
Router.route('/markdownEditor', function () {
    this.render('markdownEditor');
    this.layout('mainLayout');
});
