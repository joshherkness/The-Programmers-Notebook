// editor.js

var editor;
var lastEditor;

Template.editor.onCreated( function() {
    console.log("created");
});

Template.editor.onRendered(function () {

    // Create the ace editor
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

    //editor.setValue();

    this.autorun( function () {
        if (this.data) {
            console.log(this.data.content);
            editor.setValue(this.data.content);
        }
    }.bind(this));
});

Template.editor.helpers({
    create: function(){

    },
    currentDocument: function () {
        //console.log(getCurrentDocument());
        return getCurrentDocument();
    },
    currentDocumentTitle: function () {
        return getCurrentDocumentTitle();
    }
});


Template.editor.events({
    'blur #title' : function(event) {
        setCurrentDocumentTitle(event.target.value);
    },
    'submit #title-form' : function(event) {
        event.preventDefault();
        setCurrentDocumentTitle(event.target.text.value);
    },
    'change #editor' : function(event) {
        console.log("change");
    }
});

function redrawEditor(editor) {

}


/**
 * Functions
 */

/**
 * Retrieves a JSON representation of a document, given its key.
 * @param  {String} id String value of the documents key.
 * @return {[JSON]}    JSON representation of the document.
 */
function getDocument(id) {
    var document;
    if (Documents) {
        document = Documents.findOne(id);
    }
    return document;
}

/**
 * Retrieves a JSON representation of the current document.
 * @return {Object} JSON representation of the document.
 */
function getCurrentDocument() {
    var currentDocument;
    if (Session.get('currentDocument')) {
        currentDocument = getDocument(Session.get('currentDocument'));
    }
    return currentDocument;
}

/**
 * Retrieves the value of a given key for the current document.
 * @param  {String} key String value of desired key.
 * @return {object}     Object with value of key.
 */
function getCurrentDocumentValue(key) {
    var value;
    var currentDocument = getCurrentDocument();
    if (currentDocument) {
        value = currentDocument[key];
    }
    return value;
}

/**
 * Retrieves the current documents content value.
 * @return {Object} Object with value of key 'content'.
 */
function getCurrentDocumentContent() {
    return getCurrentDocumentValue("content");
}

/**
 * Retrieves the current documents title value.
 * @return {Object} Object with value of key 'title'.
 */
function getCurrentDocumentTitle() {
    return getCurrentDocumentValue("title");
}

/**
 * Sets the key of 'title' to a given value.
 * @param {String} title Desired title.
 */
function setCurrentDocumentTitle(title) {
    var currentDocument = getCurrentDocument();
    if (currentDocument) {
        Documents.update({_id: Session.get('currentDocument')}, {$set: {title:title}});
    }
}

/**
 * Sets the key of 'content' to a given value.
 * @param {String} content Desired content.
 */
function setCurrentDocumentContent( content ) {
    var currentDocument = getCurrentDocument();
    if (currentDocument) {
        Documents.update({_id: Session.get('currentDocument')}, {$set: {content:content}});
    }
}
