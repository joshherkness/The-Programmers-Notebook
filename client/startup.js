/*
 * startup.js
 *
 * This function will be run on Meteors startup.
 */

Meteor.startup( function () {

    // Initiallize the documents collection
    Documents = new Mongo.Collection(null);

    Documents.insert({
        title: "Getting Started",
        content: "# Hello, welcome to the programmers notebook\n\n----\n\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\n## What is Markdown?\n\nsee [Wikipedia](http://en.wikipedia.org/wiki/Markdown)\n\n\> Markdown is a lightweight markup language, originally created by John Gruber and Aaron Swartz allowing people \"to write using an easy-to-read, easy-to-write plain text format, then convert it to structurally valid XHTML (or HTML)\".\n\n## usage\n\n1. Write markdown text in this textarea.\n2. Click 'HTML Preview' button.\n\n## markdown quick reference\n\n# headers\n\n*emphasis*\n\n**strong**\n\n* list\n\n>block quote\n\n    code (4 spaces indent)\n[links](http://wikipedia.org)\n\n## changelog\n\n* 17-Feb-2013 re-design",
        createdAt: new Date()
    });

    // Retrieve Source Code Pro font family
    WebFontConfig = {
        google: {
            families: ['Source+Code+Pro::latin']
        }
    };
    (function() {
        var wf = document.createElement('script');
        wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
            '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
        wf.type = 'text/javascript';
        wf.async = 'true';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(wf, s);
    })();

     // Configure the markdown parser
     marked.setOptions({
         renderer: new marked.Renderer(),
         gfm: true,
         tables: true,
         breaks: false,
         pedantic: false,
         sanitize: true,
         smartLists: true,
         smartypants: false
     });

});
