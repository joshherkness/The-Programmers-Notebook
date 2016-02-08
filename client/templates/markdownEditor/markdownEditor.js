/*
 * markdownEditor.js
 */

Template.markdownEditor.onRendered( function() {

    AceEditor.instance("editor",{
        theme: "github",
        mode: "markdown"
    },function(editor){
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
            wrap: false
        });

        // Editor events example
        editor.on("change", function () {
            console.log(editor.getValue());
        });
    });
});
