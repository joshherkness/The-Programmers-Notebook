/**
 * editor.js
 *
 * @author Joshua Herkness
 */

// Create an instance of Edit Session to be used by the ace editor.
EditSession = require("ace/edit_session").EditSession;

/**
 * Template function called when each instance of the template is rendered.
 * Note: This method is not called very often.
 */
Template.editor.onRendered(function () {

	// Configure the marked converter
	marked.setOptions({
		highlight: function (code) {
    		return hljs.highlightAuto(code).value;
  		},
		renderer: new marked.Renderer(),
		gfm: true,
		tables: true,
		breaks: false,
		pedantic: false,
		sanitize: true,
		smartLists: true,
		smartypants: true
	});

    // Ensure that the wysiwyg editor is contenteditable
	var rtEditorElement = document.getElementById('rt-editor');
	rtEditorElement.setAttribute( 'contenteditable', true );

    // Create and configure the rich text editor
	CKEDITOR.inline( 'rt-editor', {
		// Allow some non-standard markup that we used in the introduction.
		extraAllowedContent: 'h1;strong;em;ua(documentation);abbr[title];pre(*);code(*);blockquote;span(*);a[href];ol;ul;li;u;s;img(*)[*]',
		removePlugins: 'contextmenu,tabletools,toolbar',
		extraPlugins: 'sourcedialog',
		format_tags: 'p;h1;h2;h3;h4;h5;h6;pre;address;div',
		removeButtons: ''
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

	// Create and configure the edit manager
    this.editManager = new EditManager();
	this.editManager.mdEditor = mdEditor;
	this.editManager.rtEditor = rtEditor;
	this.editManager.setMode(ModeEnum.MD);

	//Function that auto runs when context changes.
    this.autorun(function(){

		var context = Template.currentData();

		if (context) {
			this.editManager.load(context);
		}

    }.bind(this));

});

/**
 * Collection of Meteor tempalte event handlers.
 */
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
    'click #strike' : function(event, template) {

		var editManager = template.editManager;
		editManager.strike();
    },
    'click #code' : function(event, template) {
        console.log("Code");
		var editManager = Template.instance().editManager;
		console.log(editManager.rtEditor);
		editManager.codeBlock();
    },
    'click #link' : function(event, template) {
        console.log("Link");
		var editManager = Template.instance().editManager;
		editManager.link();
    },
    'click #image' : function(event, template) {
        console.log("Image");
		var editManager = Template.instance().editManager;
		editManager.image();
    },
    'click #bulleted-list' : function(event, template) {
        console.log("Bulleted List");
		var editManager = Template.instance().editManager;
		editManager.bulletedList();
    },
    'click #numbered-list' : function(event, template) {
        console.log("Numbered List");
		var editManager = Template.instance().editManager;
		editManager.numberedList();
    },
    'click #clear' : function(event, template) {
        console.log("Clear");
		var editManager = Template.instance().editManager;
		editManager.clearFormat();
    },
    'click #more' : function(event, template) {
        console.log("More");
		var renderer = new marked.Renderer();
		console.log(renderer);
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

/**
 * Collection of Meteor template helpers.
 */
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

/**
 * Sets the title for a given context.
 * @param {object} context Context with _id to be modified.
 * @param {String} title   New title.
 */
function setDocumentTitle(context, title){
    var _id = context._id;
    if (context && context.title) {
        Documents.update(_id, {
        $set: {title: title}
      });
    }
}

/**
 * Sets the content for a given context.
 * @param {object} context Context with _id to be modified.
 * @param {String} content   New content.
 */
function setDocumentContent(context, content){
    var _id = context._id;
    if (context) {
        Documents.update(_id, {$set: {content: content}});
    }
}

/**
 * Enum to describe the editors mode.
 */
ModeEnum = {
	MD: 0,
	RT: 1
};

/**
 * Creates an instance of the Edit Manager object, which handles the interaction
 * between different modes.
 *
 * @constructor
 */
function EditManager() {

	this.mdEditor = undefined;
	this.rtEditor = undefined;
	this.context = undefined;
	this.mode = ReactiveVar(undefined);

	/**
	 * Function used to save the managers current context.
	 */
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

	/**
	 * Function used to load a new context into the manager.
	 * @param  {object} context Context to be loaded into the manager.
	 */
	this.load = function (context) {
		if (!this.context || this.context._id != context._id) {

			console.log('Loading...');

			this.context = context;

			// Load into mdEditor
			var editSession = new EditSession(context.content);
			editSession.setUndoMAnager(new ace.UndoManager());
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

	/**
	 * Function used to refresh the context within a given mode.
	 * @param  {ModeEnum} mode Mode to be refreshed within manager.
	 */
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

	/**
	 * Sets the managers mode to a given ModeEnum.
	 * @param {ModeEnum} mode The new mode.
	 */
	this.setMode = function (mode) {
		if (this.mode.get() == mode) {
			return;
		} else {
			console.log('Switching to mode ' + mode);
			this.mode.set(mode);
			this.refresh(mode);
		}
	};

	/**
	 * Bolds the selection within the current mode.
	 */
	this.bold = function () {
		switch (this.mode.get()) {
			case ModeEnum.MD:
				surround(this.mdEditor, '**', '**');
				break;
			case ModeEnum.RT:
				// Apply command
				this.rtEditor.execCommand('bold');
				break;
			default:
				console.error('Unable to bold...');
		}

	};

	/**
	 * Italicise seleciton withing the current mode.
	 */
	this.italic = function () {
		switch (this.mode.get()) {
			case ModeEnum.MD:
				surround(this.mdEditor, '*', '*');
				break;
			case ModeEnum.RT:
				// Apply command
				this.rtEditor.execCommand('italic');
				break;
			default:
				console.error('Unable to italic...');
		}

	};

	this.clearFormat = function () {
		switch (this.mode.get()) {
			case ModeEnum.MD:

				break;
			case ModeEnum.RT:
				this.rtEditor.execCommand('removeFormat');
				break;
			default:
				console.log('Unable to clear formating...');
		}
	};

	this.codeBlock = function () {
		switch (this.mode.get()) {
			case ModeEnum.MD:
				break;
			case ModeEnum.RT:
				var style = new CKEDITOR.style({element: 'pre'});
				console.log(style.checkActive(this.rtEditor.elementPath(), this.rtEditor));
				if (style.checkActive(this.rtEditor.elementPath(), this.rtEditor)) {
					this.rtEditor.removeStyle(style);
				} else {
					this.rtEditor.applyStyle(style);
				}
				break;
			default:
				console.log('Unable to apply code block style...');
		}
	};

	this.bulletedList = function () {
		switch (this.mode.get()) {
			case ModeEnum.MD:
				surround(this.mdEditor, '* ', '');
				break;
			case ModeEnum.RT:
				this.rtEditor.execCommand('bulletedlist');
				break;
			default:
				console.log('Unable to apply bullet list...');
		}
	};

	this.numberedList = function () {
		switch (this.mode.get()) {
			case ModeEnum.MD:
				break;
			case ModeEnum.RT:
				this.rtEditor.execCommand('numberedlist');
				break;
			default:
				console.log('Unable to apply numbered list...');
		}
	};

	this.strike = function () {
		switch (this.mode.get()) {
			case ModeEnum.MD:
				surround(this.mdEditor, '~~', '~~');
				break;
			case ModeEnum.RT:
				this.rtEditor.execCommand('strike');
				break;
			default:
				console.log('Unable to strike...');
		}
	};

	this.image = function () {
		switch (this.mode.get()) {
			case ModeEnum.MD:
				surround(this.mdEditor, '![', '](http://)');
				break;
			case ModeEnum.RT:
				this.rtEditor.execCommand('image');
				break;
			default:
				console.log('Unable to add image...');

		}
	};

	this.link = function () {
		switch (this.mode.get()) {
			case ModeEnum.MD:
				surround(this.mdEditor, '[','](http://)');
				break;
			case ModeEnum.RT:
				this.rtEditor.execCommand('link');
				break;
			default:
				console.log('Unable to add link...');
		}
	};
}

function surround(mdEditor, startText, endText) {
	var selectedText = mdEditor.session.getTextRange(mdEditor.getSelectionRange());
	if (selectedText) {
		mdEditor.insert(startText + selectedText + endText);
	} else {
		var cursor = mdEditor.selection.getCursor();
		mdEditor.insert(startText + endText);
		mdEditor.moveCursorTo(cursor.row, cursor.column + startText.length);
		mdEditor.focus();
	}
}
