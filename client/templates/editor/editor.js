// editor.js
Template.editor.events({
    'click': function (event) {
        console.log("here");
    }
});

Template.editor.onRendered(function () {

    // Create the ace editor
    this.editor = ace.edit("editor");

    this.editor.getSession().setMode("ace/mode/text");

    this.editor.setTheme("ace/theme/tomorrow");

    this.editor.renderer.setScrollMargin(40, 40);

    this.editor.setOptions({
        highlightActiveLine: false,
        highlightGutterLine: false,
        showGutter:false,
        fontSize: "14pt",
        fontFamily: "Source Code Pro",
        tabSize: 4,
        displayIndentGuides: false,
        showPrintMargin: false,
        scrollPastEnd: 0.5,
        wrap: true
    });
});
