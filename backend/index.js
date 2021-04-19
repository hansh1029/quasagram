/*
  dependencies
*/

const express = require('express')

/*
  config - express
*/

const app = express()

/*
  endpoint - posts
*/
const port = 3000;

app.get("/", (request, response) => {
    response.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
