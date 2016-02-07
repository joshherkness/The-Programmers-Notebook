/*
 * markdownEditor.js
 */

Template.markdownEditor.onRendered( function() {

});

Template.editor.helpers({
  configEditor: function (editor) {
      return function(editor) {
          // Set some options for the Ace editor
          editor.setTheme('ace/theme/tomorrow');
          editor.getSession().setMode('ace/mode/markdown');
          editor.setShowPrintMargin(false);
          editor.getSession().setUseWrapMode(true);
          editor.setOptions({
              highlightActiveLine: false,
              highlightGutterLine: false,
              showGutter: true,
              tabSize: 4,
              displayIndentGuides: false,
              wrap: true,
              showPrintMargin: false,
              fontFamily: "Source Code Pro",
              fontSize: "14pt",
              scrollPastEnd: true,
          });
          editor.renderer.setScrollMargin(40, 40);
          editor.renenrer.setGutterMargin(40, 40);

          // Editor events
          editor.on("change", function () {
              var div = document.getElementById("editor");
              console.log(" " + div.style.height);
          });
      }
  }
});

Template.editor.events({
    "blur": function (event) {
        console.log("Hello");
    }
});
