/*
 * markdownEditor.js
 */

Template.markdownEditor.onRendered( function() {

});

Template.aceEditor.onRendered( function() {
    window.editor = new ReactiveAce();

    editor.attach(ace.edit("aceEditor"));
    editor.theme = "tomorrow";
    editor.syntaxMode = "markdown";
});
