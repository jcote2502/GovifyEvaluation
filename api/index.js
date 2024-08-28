const express = require('express');
const app = express();
const port = 3001;
const cors = require ('cors');

// Due to the locality of the application from this project not designed for production the env file will be ignored

// doesn't require headers type in front end or backend when communicating
app.use(cors());

app.use(express.json());

// use controllers
app.use("/api", require("./controllers"));


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});