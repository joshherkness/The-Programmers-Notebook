/**
 * editor.js
 *
 * @author Joshua Herkness
 */

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
		extraAllowedContent: 'h1;h2;h3;h4;h5;h6;hr;strong;em;ua(documentation);abbr[title];pre;code[*];blockquote;span(*);a[href];ol;ul;li;u;s;img(*)[*]',
		removePlugins: 'contextmenu,tabletools,toolbar',
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
	mdEditor.$blockScrolling = Infinity;

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

	// $( ".menu-footer" ).on( "click", function() {
	//		this.editManager.bold();
	// }.bind(this));

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
    'click #h1' : function(event, template) {

		var editManager = template.editManager;
		editManager.heading(1);
    },
    'click #h2' : function(event, template) {

		var editManager = template.editManager;
		editManager.heading(2);
    },
    'click #h3' : function(event, template) {

		var editManager = template.editManager;
		editManager.heading(3);
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
    'click #blockquote' : function(event, template) {
        console.log("Blockquote");
		var editManager = Template.instance().editManager;
		editManager.blockquote();
    },
    'click #clear' : function(event, template) {
        console.log("Clear");
		var editManager = Template.instance().editManager;
		editManager.clearFormat();
    },
    'click #more' : function(event, template) {
        console.log("More");
		var editManager = Template.instance().editManager;
		var cursor = editManager.mdEditor.selection.getCursor();
		console.log(cursor);
		var token = editManager.mdEditor.getSession().getTokenAt(cursor.row, cursor.column);
		console.log(token);

    },
    'click #md' : function(event, template) {
		var editManager = template.editManager;
		editManager.setMode(ModeEnum.MD);
    },
    'click #rt' : function(event, template) {
		var editManager = template.editManager;
		editManager.setMode(ModeEnum.RT);
    },

    'click .export-data': function( event, template ) {
    $( event.target ).button( '...' );

    var boo = new Blob([this.content]);
    let fileName = this.title + ".md";
    saveAs( boo, fileName );

    $( event.target ).button( 'reset' );
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
			var editSession = ace.createEditSession(context.content, 'ace/mode/markdown');
			editSession.setUseWrapMode(true);
			this.mdEditor.setSession(editSession);
			this.mdEditor.getSession().setMode("ace/mode/markdown");
			this.mdEditor.getSession().on('change', function (err) {
				this.save();
			}.bind(this));

			// Load into rtEditor
			this.rtEditor.setData(marked(context.content));
			this.rtEditor.on('change', function(err) {
				console.log("Change!");
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

		var mdFunction = function () {
			surround(this.mdEditor, '**', '**');
		}.bind(this);

		var rtFunction = function () {
			this.rtEditor.execCommand('bold');
		}.bind(this);

		executeFunctionOnMode(this.mode.get(), mdFunction, rtFunction);

	};

	/**
	 * Italicise seleciton withing the current mode.
	 */
	this.italic = function () {

		var mdFunction = function () {
			surround(this.mdEditor, '*', '*');
		}.bind(this);

		var rtFunction = function () {
			this.rtEditor.execCommand('italic');
		}.bind(this);

		executeFunctionOnMode(this.mode.get(), mdFunction, rtFunction);


	};

	this.clearFormat = function () {

		var mdFunction = function () {
			surround(this.mdEditor, '* ', '');
		}.bind(this);

		var rtFunction = function () {
			this.rtEditor.execCommand('removeFormat');
		}.bind(this);

		executeFunctionOnMode(this.mode.get(), mdFunction, rtFunction);

	};

	this.codeBlock = function () {

		var mdFunction = function () {
			surround(this.mdEditor, '```\n', '\n```');
		}.bind(this);

		var rtFunction = function () {
			var preStyle = new CKEDITOR.style({element: 'pre', type: CKEDITOR.STYLE_BLOCK});
			var codeStyle = new CKEDITOR.style({element: 'code', type: CKEDITOR.STYLE_BLOCK});

			if (preStyle.checkActive(this.rtEditor.elementPath(), this.rtEditor) | codeStyle.checkActive(this.rtEditor.elementPath(), this.rtEditor)) {
				this.rtEditor.removeStyle(preStyle);
				this.rtEditor.execCommand('removeFormat');
			} else {
				elem = this.rtEditor.getSelectedHtml();
	    		this.rtEditor.insertHtml( '<pre><code>'+this.rtEditor.getSelectedHtml(true)+'</code></pre>' );
				//this.rtEditor.applyStyle(preStyle);
				//this.rtEditor.applyStyle(codeStyle);
			}
		}.bind(this);

		executeFunctionOnMode(this.mode.get(), mdFunction, rtFunction);

	};

	this.bulletedList = function () {

		var mdFunction = function () {
			surround(this.mdEditor, '* ', '');
		}.bind(this);

		var rtFunction = function () {
			this.rtEditor.execCommand('bulletedlist');
		}.bind(this);

		executeFunctionOnMode(this.mode.get(), mdFunction, rtFunction);

	};

	this.numberedList = function () {

		var mdFunction = function () {
			surround(this.mdEditor, '1. ', '');
		}.bind(this);

		var rtFunction = function () {
			this.rtEditor.execCommand('numberedlist');
		}.bind(this);

		executeFunctionOnMode(this.mode.get(), mdFunction, rtFunction);

	};

	this.strike = function () {

		var mdFunction = function () {
			surround(this.mdEditor, '~~', '~~');
		}.bind(this);

		var rtFunction = function () {
			this.rtEditor.execCommand('strike');
		}.bind(this);

		executeFunctionOnMode(this.mode.get(), mdFunction, rtFunction);

	};

	this.image = function () {

		var mdFunction = function () {
			surround(this.mdEditor, '![', '](http://)');
		}.bind(this);

		var rtFunction = function () {
			this.rtEditor.execCommand('image');
		}.bind(this);

		executeFunctionOnMode(this.mode.get(), mdFunction, rtFunction);

	};

	this.link = function () {

		var mdFunction = function () {
			surround(this.mdEditor, '[','](http://)');
		}.bind(this);

		var rtFunction = function () {
			this.rtEditor.execCommand('link');
		}.bind(this);

		executeFunctionOnMode(this.mode.get(), mdFunction, rtFunction);

	};

	this.heading = function (level) {

		var mdFunction = function () {
			surround(this.mdEditor, '#'.repeat(level) + ' ','');
		}.bind(this);

		var rtFunction = function () {
			var style = new CKEDITOR.style({element: "h"+level});
			toggleStyle(this.rtEditor, style);
		}.bind(this);

		executeFunctionOnMode(this.mode.get(), mdFunction, rtFunction);

	};

	this.blockquote = function () {

		var mdFunction = function () {
			surround(this.mdEditor, '> ','');
		}.bind(this);

		var rtFunction = function () {
			this.rtEditor.execCommand('blockquote');
		}.bind(this);

		executeFunctionOnMode(this.mode.get(), mdFunction, rtFunction);

	};

	var executeFunctionOnMode = function (mode, mdFunction, rtFunction) {
		switch (mode){
			case ModeEnum.MD :
				try {
					mdFunction();
				} catch (e) {
					console.error(e);
				}
				break;
			case ModeEnum.RT :
				try {
					rtFunction();
				} catch (e) {
					console.error(e);
				}
				break;
			default:
				console.error('Please use a valid mode!');
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

function toggleStyle(rtEditor, style) {
	if (style.checkActive(rtEditor.elementPath(), rtEditor)) {
		rtEditor.removeStyle(style);
	} else {
		rtEditor.applyStyle(style);
	}
	rtEditor.fire( 'saveSnapshot' );
}
