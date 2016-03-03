// editor.js

var editor;

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

    this.autorun( function () {
        var context = Template.currentData();
        if (context && context.content) {
            editor.setValue(context.content);
        }
    }.bind(this));
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
