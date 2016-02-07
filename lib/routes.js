/*
 * routes.js
 */

Router.configure({
    layoutTemplate: 'applicationLayout'
});

// Landing Page
Router.route('/', function () {
  this.render('landingPage');
  this.layout('applicationLayout');
});

// Markdown editor
Router.route('/markdownEditor', function () {
    this.render('markdownEditor');
    this.layout('applicationLayout');
});
