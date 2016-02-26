Template.applicationLayout.events({
    "click #menu-toggle" : function (event, template) {
        event.preventDefault();
        $("#content").toggleClass("expand");
    }
});
