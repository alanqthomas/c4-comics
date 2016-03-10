# Build Process
###### by alanqthomas
## Project setup

#### Cloning and Import
1. Clone the [repo](https://github.com/alanqthomas/maximumgreen)
2. Import the project into Eclipse as a Git project
  - Be sure you are using Java 7, not 8
    - In Eclipse: Window->Preferences->Java->Installed JREs - Select some version of JDK 7
  - Eclipse should show errors because it's missing the Google App Engine SDK, which you will now provide. I'm using version 1.9.30. Newer versions shouldn't cause issues
3. Right click the project and go to Properties->Java Build Path->Order and Export
4. Check off App Engine SDK, hit apply, and all the JARs for the App Engine SDK should now be properly in war/WEB-INF/lib

#### Dependency Mangement
1. Open your command line application of choice and navigate to your project folder
2. Run the following commands:
  - `npm install`
  - `bower install`
  - *You must have [NodeJS](https://nodejs.org) installed on on your machine to run these commands*
  - *Aside on dependency management:*
    - npm (Node package manager) is a system that will download and install necessary dependencies for your project. One dependency we are using GruntJS (a task automator). npm typically handles NodeJS modules, such as Grunt, that typically have to deal with the server side. The list of dependencies can be found in `/package.json`
    - bower is another dependency manager that deals more with frontend frameworks, i.e. JavaScript, CSS, HTML. We are using Bootstrap, AngularJS, SASS, among others. Instead of fetching these manually and including them in our directories, or simply smushing them into our repo, we can load them from the web as we need it and also be able easily keep these dependencies up to date if they receive bug-fixes, etc. The list of dependencies can be found in `/bower.json`
3. You can now run the project in Eclipse. Run-> Web Application. The server will start up and you can find the web app running on whatever address the Eclipse console tells you (typically, http://localhost:8888)

## Working on the Project
1. We are using a task runner called [Grunt](http://http://gruntjs.com/).
   - This makes a lot of things easier and automated. Less file management, more productivity, less headaches. See `/Gruntfile.js` to see exactly what Grunt is doing for us. Read [documentation](http://gruntjs.com/sample-gruntfile) if you're unclear.     
   - One of the great things it does for us is file concatenation. We're splitting our our JS files into small, manageable pieces, but trying to link all of them in our `index.html` is a pain. Grunt will concatenate all of our JS files into one, [minify](https://en.wikipedia.org/wiki/Minification_(programming)) it, and allow us to link to that one file in our `index.html`
   - It will also monitor for any changes in any `.js`, `.scss`, `.css`, `.html` files and re-run any necessary tasks automagically
   - To use Grunt, run the `grunt` command in the root directory of the project. This will run all the tasks we need, and continue to run while you work so everything will be updated once any relevant file is saved.
2. [SASS](http://sass-lang.com/)
   - SASS is a CSS pre-processor. It gives us powerful functionality such as variables in CSS, nested styles, partials and much more. It makes CSS more modular, and easier to maintain
   - SASS **is not** a replacement for CSS. It is simply an easy way to develop and maintain our code as developers. SASS 'compiles' into plain old CSS.
   - Grunt will take care of this compilation. It will take all of our SASS files, make them one CSS file, then minify it, leaving us with `styles.min.css`
   - As long as you have run the `grunt` command, and it is still running, SASS compilation should continue to occur any time changes are made
   - This Grunt command requires [Ruby](https://www.ruby-lang.org/en/downloads/) and SASS to be installed on your machine
     - Windows users install Ruby using the link above. Mac users, you get a pass. Ruby comes pre-installed on your machine. Linux users, get a new operating system, Linux isn't better.
     - Once you have Ruby, run the following command from anywhere `gem install sass`, and voila, SASS is installed and the grunt task will run smoothly
3. [AngularJS](https://angularjs.org/) (Version 1)
  - Learn Angular, it's the most popular and widely used frontend frameworks out there. It's powerful, modern, and robust. There are plenty of resources online. At the very least, learn about:
    - [controllers](http://www.w3schools.com/angular/angular_controllers.asp) : the C in MVC. This will provide our web app's frontend logic. From form submission, to retrieving data from the backend, to sorting a table, this where most of the magic happens
    - [ui-router](https://angular-ui.github.io/ui-router/) : This Angular module will let us route our website efficiently and help us separate our HTML into partials. We only need one base page, and the partials will be injected into the main page. So technically, we never "load another page", but we get effectively the same thing, except easier to develop and maintain.
    - [angular-google-gapi](https://github.com/maximepvrt/angular-google-gapi) : This Angular module helps us communicate with our Cloud Endpoints backend. It wraps all the Google Client JS code into a [service](https://docs.angularjs.org/guide/services), removing the need to worry about when everything will load, and makes API calls super simple. Just take a quick scroll through it - it's fairly straight-forward, the examples will probably help the most

## Directory Structure
- `/`
  - `.gitignore` : list out all of the files that will be ignored by git i.e. not staged or committed
  - `.bower.json` : package file listing all Bower dependencies
  - `.package.json` : package file listing all npm dependencies  
  - `Gruntfile.js` : configuration file for Grunt, listing all tasks  
  - `README.md` : Read this  
  - `src/com/maximumgreen/c4/` : all the Google Cloud Endpoints entities go here  
    - `endpoints/` : all the Google Cloud Endpoints endpoints go here
  - `war/`   
    - `favicon.ico` : [favicon](https://en.wikipedia.org/wiki/Favicon) for the whole website
    - `index.html` : main HTML page. Includes all linking of files i.e. CSS, JS, and also navigation that is shared between all pages
    - `css/`
      - `styles.css` : compiled CSS from all SASS files
      - `styles.min.css` : minified version of all styles. This is what is linked to html
      - `sass/`
        - `base.scss` : think of this as the "index" of the SASS files. All partials will be imported from here as well as any code that should not be in a partials
        - `_*.scss` : any file that starts with an underscore is a partial that can be imported into the base
    - `js/`
      - `app.js` : declare our Angular app and its dependencies
      - `config.js` : any config that needs to occur on our angular app, e.g. routing
      - `dist/` : the concatenated and minified JS files, including all the source files
      - `controllers/` : contains all controllers, generally one controller per "page"
      - `services/` : contains all [services](https://docs.angularjs.org/guide/services) we will create e.g. authorization
    - `lib/`
      - `bootstrap/` : since we are using a customized version of Bootstrap, we will not add it to our dependency management - we don't want the original bootstrap
      - `sugarjs/` : a "javascript utility belt" library, with functions that maybe should have been in the language in the first place. Has some very helpful array functions in particular
      - `bower_components` : where all our bower dependencies will be installed to
    - `views/` : these are all the HTML partials in our web app. All of these will be injected into our index.html file when called upon by our ui-router
    - `WEB-INF/`
      - `web.xml` : since we are using frontend routing, we just need to list our Cloud endpoints on here
      - `appengine-web.xml` : all the information for our app in regards to Google App Engine goes in here
      - `*.api` : a generated file from the Cloud Endpoints classes
      - `lib/` : all the JARs needed to run the backend from GAE SDK
      - `classes/` : class files from our Java sources
      - `appengine-generated` : generally don't need to worry about this. Mostly for datastore stuff
