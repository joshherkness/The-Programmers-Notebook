/*
 * codeEditor.js
 */

Template.codeEditor.onCreated(function () {

    // Variables
    this.currentMode = new ReactiveVar("text");
    this.modeList = ace.require('ace/ext/modelist');
    this.shouldHideMode = new ReactiveVar(false);
    this.shouldEnableModeSelect = new ReactiveVar(true);

    this.buffer = new Buffer("editor");
});

Template.codeEditor.onRendered(function () {

    // Create the ace editor
    this.editor = ace.edit("editor");

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

Template.codeEditor.helpers({
    "getCurrentMode" : function () {
        return Template.instance().currentMode.get();
    },
    "getModes" : function () {
        return Template.instance().modeList.modes;
    },
    "shouldHideMode" : function () {
        return Template.instance().shouldHideMode.get();
    },
    "shouldEnableModeSelect" : function () {
        return Template.instance().shouldEnableModeSelect.get();
    },
    "setShouldHideMode" : function (bool) {
        Template.instance().shouldHideMode.set(bool);
    },
    "setShouldEnableModeSelect" : function (bool) {
        Template.instance().shouldEnableModeSelect.set(bool);
    }
});

Template.codeEditor.events({
    "click #dropdown-item" : function (event, template) {
        //console.log($(event.target).attr("value"));
        var mode = $(event.target).attr("value");
        template.currentMode.set(mode);
    }
});
