// menu.js
Files = new Mongo.Collection(null);

Template.menu.helpers({
  files: function () {
  // Show newest tasks at the top
  return Files.find({}, {sort: {createdAt: -1}});
}
})

Template.menu.events({
  "submit .new-file": function (event) {
  // Prevent default browser form submit
  event.preventDefault();
  // Get value from form element
  var text = event.target.text.value;
  // Insert a task into the collection
  Files.insert({
    text: text,
    data: "",
    createdAt: new Date() // current time
  });
  // Clear form
  event.target.text.value = "";
},
    'click .menu-item': function (event) {
        console.log("Click menu item");
    }
});

Template.file.events({

  "click .delete": function () {
    Files.remove(this._id);
  }
});
