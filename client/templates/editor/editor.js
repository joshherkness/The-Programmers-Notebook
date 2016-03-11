// editor.js

// Ace editor object
var editor;
// Used by ace editor
var EditSession = require("ace/edit_session").EditSession;

var currentBuffer = new Buffer(undefined);

Template.editor.onRendered(function () {

    // Create and configure the ace editor.
    editor = ace.edit("editor");
    editor.getSession().setMode("ace/mode/markdown");
    editor.setTheme("ace/theme/tomorrow");
    editor.renderer.setScrollMargin(40, 40);
    editor.setOptions({
        highlightActiveLine: false,
        highlightGutterLine: false,
        showGutter:true,
        fontSize: "14pt",
        fontFamily: "Source Code Pro",
        tabSize: 4,
        displayIndentGuides: false,
        showPrintMargin: false,
        scrollPastEnd: 0.5,
        wrap: true,
        showFoldWidgets: false
    });

    //Function auto runs when content variables change
    this.autorun(function(){

        var context = Template.currentData();

        if (context && context.content) {
            if (currentBuffer._id == context._id) {
                return;
            } else {
                currentBuffer = new Buffer(context._id);
                var editSession = new EditSession(context.content);
                editor.setSession(editSession);
                editor.getSession().on('change', function (e) {
                    console.log(currentBuffer);
                    setDocumentContent(context, editor.getValue());
                });
            }
        }
    });
});

Template.editor.events({
    'blur #title' : function(event, template) {
        var context = template.data;
        setDocumentTitle(context, event.target.value);
    },
    'submit #title-form' : function(event, template) {
        var context = template.data;
        event.preventDefault();
        setDocumentTitle(context, event.target.text.value);
    },
    'change #editor' : function(event, template) {
        console.log("change");
    }
});

/**
 * Functions
 */

function setDocumentTitle(context, title){
    var _id = context._id;
    if (context && context.title) {
        Documents.update(_id, {
        $set: {title: title}
      });
    }
}

function setDocumentContent(context, content){
    var _id = context._id;
    if (context && context.content) {
        Documents.update(_id, {
        $set: {content: content}
      });
    }
}


function Buffer(id) {
  this._id = id;
}
