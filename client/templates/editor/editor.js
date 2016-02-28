// editor.js
Template.editor.events({
    'click': function (event) {
        console.log("here");
    }
});

// editor.js
/*
Template.editor.onCreated(function () {

    // Variables
    this.currentMode = new ReactiveVar("text");
    this.modeList = ace.require('ace/ext/modelist');
    this.shouldHideMode = new ReactiveVar(false);
    this.shouldEnableModeSelect = new ReactiveVar(true);

    this.buffer = new Buffer("editor");
});
*/

Template.editor.onRendered(function () {

    // Create the ace editor
    this.editor = ace.edit("editor");
    console.log("created editor");

    this.editor.getSession().setMode("ace/mode/" + Template.instance().currentMode.get());

    this.editor.setTheme("ace/theme/tomorrow");

    this.editor.renderer.setScrollMargin(40, 40);

    this.editor.setOptions({
        highlightActiveLine: false,
        highlightGutterLine: false,
        showGutter:true,
        fontSize: "14pt",
        fontFamily: "Source Code Pro",
        tabSize: 4,
        displayIndentGuides: false,
        showPrintMargin: false,
        scrollPastEnd: 0.5,
        wrap: true
    });

    this.autorun( function () {
        this.editor.getSession().setMode("ace/mode/" + this.currentMode.get());
    }.bind(this));

});
