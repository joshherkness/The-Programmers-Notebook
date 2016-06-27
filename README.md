# The programmers notebook

A note taking application created for programmers, by programmers.  Initially created for a sophomore computer science course at Oakland University.

A working version of the web application can be viewed here:

```
http://the-programmers-notebook.herokuapp.com
```

> Not currently in development.

### Running the project

Ensure that the meteor command line interface is installed on your local machine.  See [this](https://www.meteor.com/install) for more details.

1. Clone this repo on a local machine.
2. Open your terminal and navigate to the projects root directory.
3. Run `$ meteor`.
4. The project should open at `http://localhost:3000/` unless noted otherwise.

### Deploying the project

This project is currently deployed using Heroku.  See [this](http://justmeteor.com/blog/deploy-to-production-on-heroku/) for additional information.

> The following should only be used by a project collaborator.

1. Clone this repo on a local machine.
2. Open your terminal and navigate to the projects root directory.
3. Ensure that you are on the master branch.
4. Run `$ git push heroku master`

### Current bugs

- When web application is initially loaded, the user must select a file and switch between `markdown` and `rich text` (In the upper right) for the content to load into the editor.

### Future plans

I plan to move away from the Meteor development environment, as it is far too opinionated.
