/*
  dependencies
*/

const express = require("express");
const admin = require("firebase-admin");
let inspect = require('util').inspect;
let Busboy = require('busboy');

/*
  config - express
*/

const app = express();

/*
  config - firebase
*/

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

/*
  endpoint - posts
*/

app.get("/posts", (request, response) => {
  response.set("Access-Control-Allow-Origin", "*");

  let posts = [];
  db.collection("posts").orderBy('date', 'desc').limit(3)
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        //console.log(doc.id, "=>", doc.data());
        posts.push(doc.data());
      });
      response.send(posts);
    });
});

/*
  endpoint - createPost
*/

app.post("/createPost", (request, response) => {
  response.set("Access-Control-Allow-Origin", "*");

  var busboy = new Busboy({ headers: request.headers });

  let fields = {};

  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
    file.on('data', function(data) {
      console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
    });
    file.on('end', function() {
      console.log('File [' + fieldname + '] Finished');
    });
  });
  
  busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
    //console.log('Field [' + fieldname + ']: value: ' + inspect(val));
    fields[fieldname] = val;
  });
  
  busboy.on('finish', function() {
    db.collection('posts').doc(fields.id).set({
      id: fields.id,
      caption: fields.caption,
      location: fields.location,
      date: parseInt(fields.date),
      imageUrl: 'https://firebasestorage.googleapis.com/v0/b/quasagram-70057.appspot.com/o/VkPf2b6.jpeg?alt=media&token=116d5f2e-dbdd-4c21-ac31-1d54674e4a7f',
    });
    console.log('Done parsing form!');
    //response.writeHead(303, { Connection: 'close', Location: '/' }); redirect to home
    // response.end();
    response.send("Done parsing form!")
  });
  request.pipe(busboy);
  // busboy.end(request).rawBody); //this is for cloud functions
});

app.listen(process.env.PORT || 3000);
