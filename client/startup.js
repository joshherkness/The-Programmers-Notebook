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
        content: "# Getting Started",
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


     // Configure paths for mtr-ace-embed plugin
     ace.config.set("modePath", "/packages/mrt_ace-embed/ace");
     ace.config.set("themePath", "/packages/mrt_ace-embed/ace");
     ace.config.set("workerPath", "/packages/mrt_ace-embed/ace");
     ace.config.set("basePath", "/packages/mrt_ace-embed/ace");

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
