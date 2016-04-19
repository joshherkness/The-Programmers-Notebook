/*
 * startup.js
 *
 * This function will be run on Meteors startup.
 */

Meteor.startup( function () {

    // Initiallize the documents collection
    if (Meteor.userId() != null){
    Documents = new Mongo.Collection(Meteor.userId());}
    else {Documents = new Mongo.Collection(null);}

    Documents.insert({
        title: "Welcome",
        content: "# Hello, welcome to the Programmers’ Notebook"
        +"\n\n* * *"
        +"\n\n_Created by Josh Herkness and Nick Neumeyer_"
        +"\n\nThe programmers notebook was conceived with the realization that programmers do not have sufficient or usable note-taking software. The idea was to create a web application that could be used to easily take notes and manipulate code blocks using markdown."
        +"\n\n## Bold and Italicize"
        +"\n\nWe can **Bold**, _Italicize_, or **_both_**"
        +"\n\n```"
        +"\nWe can **Bold**, _Italicize_, or **_both_**"
        +"\n\n```"
        +"\n\n## Headers"
        +"\n\n## Level 2"
        +"\n\n### Level 3"
        +"\n\n#### Level 4"
        +"\n\n##### Level 5"
        +"\n\n```"
        +"\n## Level 2"
        +"\n\n### Level 3"
        +"\n\n#### Level 4"
        +"\n\n##### Level 5"
        +"\n\n```"
        +"\n\n## Lists"
        +"\n\n*   Pancakes"
        +"\n*   Waffles"
        +"\n*   Coffee"
        +"\n\n1.  Star Wars"
        +"\n2.  Interstellar"
        +"\n3.  Deadpool"
        +"\n\n```"
        +"\n*   Pancakes"
        +"\n*   Waffles"
        +"\n*   Coffee"
        +"\n\n```"
        +"\n\n## Code blocks & Syntax highlighting"
        +"\n\n```"
        +"\n\n/*"
        +"\n *   HelloWorld.java "
        +"\n */"
        +"\n\npublic class HelloWorld {"
        +"\n    public static void main(String[] args) {"
        +"\n        System.out.println(\"Hello World!\");"
        +"\n    } "
        +"\n}"
        +"\n\n```"
        +"\n\n```"
        +"\n/*"
        +"\n *   HelloWorld.js "
        +"\n */"
        +"\n\nconsole.log('Hello World!');"
        +"\n\n```"
        +"\n\n```"
        +"\n\n'''"
        +"\nHelloWorld.py"
        +"\n'''"
        +"\n\nprint(\"Hello World!\")"
        +"\n\n```"
        +"\n\n## Block quotes"
        +"\n\n> We can only see a short distance ahead, but we can see plenty there that needs to be done."
        +"\n>"
        +"\n> ##### Alan Turing"
        +"\n\n```"
        +"\n> We can only see a short distance ahead, but we can see plenty there that needs to be done."
        +"\n>"
        +"\n> ##### Alan Turing"
        +"\n\n```"
        +"\n\n## We also support images and links"
        +"\n\nLearn about the iron giant [here](https://en.wikipedia.org/wiki/The_Iron_Giant)"
        +"\n\n![](http://orig13.deviantart.net/f41b/f/2014/233/3/4/abandoned_iron_giant_at_lake_in_swiss_mountains_by_fantasio-d7w3oeg.jpg)"
        +"\n\n```"
        +"\nLearn about the iron giant [here](https://en.wikipedia.org/wiki/The_Iron_Giant)"
        +"\n\n![](http://orig13.deviantart.net/f41b/f/2014/233/3/4/abandoned_iron_giant_at_lake_in_swiss_mountains_by_fantasio-d7w3oeg.jpg)"
        +"\n\n```",
        createdAt: new Date()
    });

    //Login config stuff
    /*ServiceConfiguration.configurations.upsert(
      { service: "github" },
      {
        $set: {
          service: "github",
          clientId: "446556",
          loginStyle: "popup",
          secret: "password"
        }
      });*/

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
