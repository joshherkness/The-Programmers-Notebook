// editor.js

// Used to create instances of EditSession for the ace editor
var EditSession = require("ace/edit_session").EditSession;

Session.set('mode', 'toggle-markdown');

var currentBuffer = new Buffer(undefined);

/**
 * Template function called when each instance of the template is rendered.
 * Note: This method is not called very often.
 */
Template.editor.onRendered(function () {

    // Ensure that the wysiwyg editor is contenteditable
	var previewEditor = document.getElementById( 'ckeditor' );
	previewEditor.setAttribute( 'contenteditable', true );

    // Create the wysiwyg editor
	CKEDITOR.inline( 'ckeditor', {
		// Allow some non-standard markup that we used in the introduction.
		extraAllowedContent: 'h1;strong;em;ua(documentation);abbr[title];code',
		removePlugins: 'toolbar',
		extraPlugins: 'sourcedialog',
	});

    // Retrieve the CKEditor instance and save it
    this.ckeditor = CKEDITOR.instances.ckeditor;

    // Create and configure the ace editor.
    this.markdownEditor = ace.edit("editor");
    this.markdownEditor.getSession().setMode("ace/mode/markdown");
    this.markdownEditor.setTheme("ace/theme/tomorrow");
    this.markdownEditor.renderer.setScrollMargin(40, 40);
    this.markdownEditor.setOptions({
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

        // Retrieve the template's data context
        var context = Template.currentData();

        // console.log(Template.currentData(), Template.currentData().prev());

        // Ensure that the template has a data context before we access it.
        if (context) {

            if (currentBuffer._id == context._id) {
                return;

            } else {

                currentBuffer = new Buffer(context._id);
                var editSession = new EditSession(context.content);
                this.markdownEditor.setSession(editSession);
                this.markdownEditor.getSession().setMode("ace/mode/markdown");
                this.markdownEditor.getSession().on('change', function (e) {
                    saveContentOnTemplateInstance(Template);
                }.bind(this));

                this.ckeditor.setData(marked(context.content));
                this.ckeditor.on('change', function() {
                    saveContentOnTemplateInstance(Template);
                }.bind(this));
            }
        }
    }.bind(this));

	this.editManager = new EditManager();
	this.editManager.mdEditor = this.markdownEditor;
	this.editManager.rtEditor = this.ckeditor;
	this.editManager.mdEditor.setValue("Hello");
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
    'click #bold' : function(event, template) {

        if (Session.get('mode') == "toggle-markdown") {

            var editor = template.markdownEditor;
            var selectedText = editor.session.getTextRange(editor.getSelectionRange());
            if (selectedText) {
                editor.insert("**" + selectedText + "**");
            } else {
                editor.insert("****");
                var cursor = editor.selection.getCursor();
                editor.moveCursorTo(cursor.row, cursor.column - 2);
                editor.focus();
            }
        } else if (Session.get('mode') == "toggle-preview") {
            // Retrieve the ckeditor object from the DOM
            var ckeditor = template.ckeditor;
            // Apply command
            ckeditor.execCommand('bold');
        }
    },
    'click #italic' : function(event, template) {

        if (Session.get('mode') == "toggle-markdown") {
            console.log('markdown italic');
        } else if (Session.get('mode') == "toggle-preview") {
            // Retrieve the ckeditor object from the DOM
            var ckeditor = template.ckeditor;
            // Apply command
            ckeditor.execCommand('italic');
        }
    },
    'click #code' : function(event, template) {
        console.log("Code");
        console.log(template.ckeditor);
    },
    'click #link' : function(event, template) {
        console.log("Link");
        isTextBoldAtCursor(template.markdownEditor);
    },
    'click #image' : function(event, template) {
        console.log("Image");
    },
    'click #format' : function(event, template) {
        console.log("Format");
    },
    'click #more' : function(event, template) {
        console.log("More");
        saveContentOnTemplateInstance(template);
    },
    'click #toggle-markdown' : function(event, template) {
        toggleMode(event);
    },
    'click #toggle-preview' : function(event, template) {
        toggleMode(event);
    }
});


Template.editor.helpers({
    isMarkdown: function(){
        return Session.get('mode') == 'toggle-markdown';
    },
    isPreview: function(){
        return Session.get('mode') == 'toggle-preview';
    },
    previewContent: function(){
        var context = Template.currentData();
        if (context) {
            return marked(context.content);
        } else {
            return '<p>Enter Some content in</p>';
        }
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

function toggleMode(event) {
    var target = $(event.target);
    if (target.hasClass('selected')) {
        return;
    } else {
        Session.set('mode', target.attr('id'));
        target.siblings().removeClass('selected');
        target.addClass('selected');
    }
}

function EditManager() {

	this.mdEditor = undefined;
	this.rtEditor = undefined;
	this.documentId = undefined;


	this.save = function () {

		var document = Documents.find({_id: this.documentId});

	    if (document) {

	        switch (Session.get('mode')) {
	            case 'toggle-markdown':
	                setDocumentContent(document, this.mdEditor.getValue());
	                break;
	            case 'toggle-preview':
	                var und = new upndown();
	                und.convert(this.rtEdtior.getData(), function(err, markdown) {
	                    if(err) {
	                        console.err(err);
	                    } else {
	                        setDocumentContent(document, markdown);
	                    }
	                });
	                break;
	            default:
					console.error('Save Unsuccessful');
	        }
	    }
	};
}
