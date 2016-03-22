// editor.js

// Used to create instances of EditSession for the ace editor
var EditSession = require("ace/edit_session").EditSession;

console.log(toMarkdown('<h1>Hello</h1>'));

/**
 * Template function called when each instance of the template is rendered.
 * Note: This method is not called very often.
 */
Template.editor.onRendered(function () {

    // Ensure that the wysiwyg editor is contenteditable
	var rtEditorElement = document.getElementById('rt-editor');
	rtEditorElement.setAttribute( 'contenteditable', true );

    // Create and configure the rich text editor
	CKEDITOR.inline( 'rt-editor', {
		// Allow some non-standard markup that we used in the introduction.
		extraAllowedContent: 'h1;strong;em;ua(documentation);abbr[title];pre;code',
		removePlugins: 'toolbar,contextmenu,tabletools',
		extraPlugins: 'sourcedialog',
		format_tags: 'p;h1;h2;h3;h4;h5;h6;pre;address;div'
	});

    // Retrieve the CKEditor instance and save it
    var rtEditor = CKEDITOR.instances['rt-editor'];

    // Create and configure the ace editor.
    var mdEditor = ace.edit("md-editor");
    mdEditor.getSession().setMode("ace/mode/markdown");
    mdEditor.setTheme("ace/theme/tomorrow");
    mdEditor.renderer.setScrollMargin(40, 40);
    mdEditor.setOptions({
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

    this.editManager = new EditManager();
	this.editManager.mdEditor = mdEditor;
	this.editManager.rtEditor = rtEditor;
	this.editManager.setMode(ModeEnum.RT);

	//Function auto runs when content variables change
    this.autorun(function(){

		var context = Template.currentData();

		if (context) {
			this.editManager.load(context);
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
    'click #bold' : function(event, template) {

        var editManager = template.editManager;
		editManager.bold();
    },
    'click #italic' : function(event, template) {

		var editManager = template.editManager;
		editManager.italic();
    },
    'click #code' : function(event, template) {
        console.log("Code");
		var editManager = Template.instance().editManager;
		console.log(editManager.rtEditor);
    },
    'click #link' : function(event, template) {
        console.log("Link");
    },
    'click #image' : function(event, template) {
        console.log("Image");
    },
    'click #format' : function(event, template) {
        console.log("Format");
    },
    'click #more' : function(event, template) {
        console.log("More");
    },
    'click #md' : function(event, template) {
		var editManager = template.editManager;
		editManager.setMode(ModeEnum.MD);
    },
    'click #rt' : function(event, template) {
		var editManager = template.editManager;
		editManager.setMode(ModeEnum.RT);
    }
});


Template.editor.helpers({
    isMarkdown: function(){
		var editManager = Template.instance().editManager;
		if (editManager) {
			return editManager.mode.get() == ModeEnum.MD;
		}
        return false;
    },
    isRichText: function(){
		var editManager = Template.instance().editManager;
		if (editManager) {
			return editManager.mode.get() == ModeEnum.RT;
		}
        return false;
    }
});

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
    if (context) {
        Documents.update(_id, {$set: {content: content}});
    }
}

ModeEnum = {
	MD: 0,
	RT: 1
};

function EditManager() {

	this.mdEditor = undefined;
	this.rtEditor = undefined;
	this.context = undefined;
	this.mode = ReactiveVar(undefined);

	this.save = function () {

		console.log('Saving...');

	    if (this.context) {

	        switch (this.mode.get()) {
	            case ModeEnum.MD:
	            	setDocumentContent(this.context, this.mdEditor.getValue());
	            	break;
	            case ModeEnum.RT:
					setDocumentContent(this.context, toMarkdown(this.rtEditor.getData(), { gfm: true }));
	                break;
	            default:
					console.error('Unable to save...');
	        }
	    }
	};

	this.load = function (context) {
		if (!this.context || this.context._id != context._id) {

			console.log('Loading...');

			this.context = context;

			// Load into mdEditor
			var editSession = new EditSession(context.content);
			this.mdEditor.setSession(editSession);
			this.mdEditor.getSession().setMode("ace/mode/markdown");
			this.mdEditor.getSession().on('change', function (err) {
				this.save();
			}.bind(this));

			// Load into rtEditor
			this.rtEditor.setData(marked(context.content));
			this.rtEditor.on('change', function(err) {
				this.save();
			}.bind(this));
		} else if (this.context != context){
			this.context = context;
		}
	};

	this.refresh = function (mode) {
		console.log('Refreshing...');

		if (this.context) {
			switch (mode) {
				case ModeEnum.MD:
					console.log('Refreshing mode ' + mode);
					this.mdEditor.getSession().setValue(this.context.content);
					break;
				case ModeEnum.RT:
					console.log('Refreshing mode ' + mode);
					this.rtEditor.setData(marked(this.context.content));
					break;
				default:
					console.error('Unable to refresh...');
			}
		}
	};

	this.setMode = function (mode) {
		if (this.mode.get() == mode) {
			return;
		} else {
			console.log('Switching to mode ' + mode);
			this.mode.set(mode);
			this.refresh(mode);
		}
	};

	this.bold = function () {
		switch (this.mode.get()) {
			case ModeEnum.MD:
				// Bold markdown text
				var selectedText = this.mdEditor.session.getTextRange(this.mdEditor.getSelectionRange());
	            if (selectedText) {
	                this.mdEditor.insert("**" + selectedText + "**");
	            } else {
	                this.mdEditor.insert("****");
	                var cursor = this.mdEditor.selection.getCursor();
	                this.mdEditor.moveCursorTo(cursor.row, cursor.column - 2);
	                this.mdEditor.focus();
	            }
				break;
			case ModeEnum.RT:
				// Apply command
				this.rtEditor.execCommand('bold');
				break;
			default:
				console.error('Unable to bold...');
		}

	};

	this.italic = function () {
		switch (this.mode.get()) {
			case ModeEnum.MD:
				// Italic markdown text
				var selectedText = this.mdEditor.session.getTextRange(this.mdEditor.getSelectionRange());
	            if (selectedText) {
	                this.mdEditor.insert("*" + selectedText + "*");
	            } else {
	                this.mdEditor.insert("**");
	                var cursor = this.mdEditor.selection.getCursor();
	                this.mdEditor.moveCursorTo(cursor.row, cursor.column - 1);
	                this.mdEditor.focus();
	            }
				break;
			case ModeEnum.RT:
				// Apply command
				this.rtEditor.execCommand('italic');
				break;
			default:
				console.error('Unable to italic...');
		}

	};
}
