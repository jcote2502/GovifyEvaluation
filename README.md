Justin Cote Govify Evaluation Submission

The Backend Server Directory is Designed to be able to serve the client in production.

Because the assignment is not intended for production I felt it was unecessary to fully implement serving a client.
In addition, you will see I did not implement an ENV file. Give the locality of the application and the task at hand it was not necessary.

To use my application you will need to do the following.

If you don't have psql installed you must install it. I used homebrew to manage it.

Once installed make sure to start the psql server on your local host.
If you are using home brew you can use `brew services start postgresql`.

To Start and Initialize Backend:

In /GovifyEvaluation/api  
  - execute `node dataset/db.init`
  - this tests connection while ensuring that the wellfound db is created and role admin is created
  - once it runs move to next step

In /GovifyEvaluation 
  - execute `npm start`
  - starts the backend server on localhost
  - leave this window up

Open new terminal (split terminal)
In GovifyEvaluation/client
  - execute `npm start`
  - starts the development server
  - leave this terminal running

Details about the UI and Accessibility

  - You will need to register first in order to access site (no prefabricated admin users).
  - Load Data function is not recurring or allow rollback ; once loaded in its there until you delete them by hand or restart db.

