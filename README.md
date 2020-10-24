# password generator script

## Table of Contents

* [Goal](#goal)
* [Acceptance Criteria](#acceptance-criteria)
* [Changes](#changes)
* [Live Project](#live-project)

## Goal

Provided an index.html/script.js which hook up a generate-password page that contains the UI elements and structure to support the superficial parts of a page that invoke a password-generation function, I am to fill in the meat of the actual implementation that generates such a password

## Acceptance Criteria
```
GIVEN I need a new, secure password
WHEN I click the button to generate a password
THEN I am presented with a series of prompts for password criteria
WHEN prompted for password criteria
THEN I select which criteria to include in the password
WHEN prompted for the length of the password
THEN I choose a length of at least 8 characters and no more than 128 characters
WHEN prompted for character types to include in the password
THEN I choose lowercase, uppercase, numeric, and/or special characters
WHEN I answer each prompt
THEN my input should be validated and at least one character type should be selected
WHEN all prompts are answered
THEN a password is generated that matches the selected criteria
WHEN the password is generated
THEN the password is either displayed in an alert or written to the page
```

## Changes

I slightly reorganized the provided script from the beginning to make it so that it is possible to run the script directly from node so that development directly from the terminal can be done effectively.  This means that the script may be launched directly like "$ node ./script.js"
although I recommend "$ node --trace-uncaught ./script.js" for reasons I'll get into momentarily.  This makes for an agile workflow convienent for testing without futzing around with web-tools in a browser.  To make code that runs within or without the browser requires a deliberate seperation
of the UI code from the logic.  I not only maintained such a seperation, for the purposes pf getting my test code to sucessfully check my code logic but also because decoupling of UI code is considered a best-practice for many reasons and in many contexts throughout software development spanning many languages and platforms.  (see: The Model-View-Controller design pattern for one popular approach to achieve this).

With this structure in place, I incrementally created the password-generation logic, testing it as I added the layers of functionality and eschewing global variables so that I could reliably test my code without combersome unintended interference from side-effects.  With this strategy established sucessfully and having proven its worth in its easing my development, I expect to build on this approach in future projects.

I promissed I would get into why it is better, when running script.js through node, to use "$ node --trace-uncaught ./script.js".  This is why:
As part of my testing approach, I like blowing up with exceptions in order to make failures obvious.  Furthermore, a detailed stack frame is shown to the console to trace the point of failure and this will clearly show which test failed and where.  The --trace-uncaught parameter to node enables this.

## Live Project

github project page: https://github.com/YouFarted/password<br/>
github live site: https://youfarted.github.io/password/
