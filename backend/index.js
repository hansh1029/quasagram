/*
  dependencies
*/

const express = require("express");
const admin = require("firebase-admin");
let inspect = require('util').inspect;
let Busboy = require('busboy');
let path = require('path'); //work with paths
let os = require('os'); //access to temp folder
let fs = require('fs'); //write the file to the temp folder
let UUID = require('uuid-v4');

/*
  config - express
*/

const app = express();

/*
  config - firebase
*/

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "quasagram-70057.appspot.com"
});

const db = admin.firestore();
let bucket = admin.storage().bucket();

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

  let uuid = UUID();

  var busboy = new Busboy({ headers: request.headers });

  let fields = {};
  let fileData = {};

  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    //console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
    // /tmp/xxxx.png
    let filepath = path.join(os.tmpdir(), filename);
    file.pipe(fs.createWriteStream(filepath));
    fileData = { filepath, mimetype };


    // file.on('data', function(data) {
    //   console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
    // });
    // file.on('end', function() {
    //   console.log('File [' + fieldname + '] Finished');
    // });
  });
  
  busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
    //console.log('Field [' + fieldname + ']: value: ' + inspect(val));
    fields[fieldname] = val;
  });
  
  busboy.on('finish', function() {
    // upload file to the storage
    bucket.upload(
      fileData.filepath,
      {
        uploadType: 'media',
        metadata: {
          metadata: {
            contentType: fileData.mimetype,
            firebaseStorageDownloadTokens: uuid
          }
        }
      },
      (err, uploadedFile) => {
        if (!err) {
          createDocument(uploadedFile) //call back function
        }
      }
    )

    // upload data to the db
    function createDocument(uploadedFile) {
      db.collection('posts').doc(fields.id).set({
        id: fields.id,
        caption: fields.caption,
        location: fields.location,
        date: parseInt(fields.date),
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${ bucket.name }/o/${ uploadedFile.name }?alt=media&token=${ uuid }`
      }).then(() => {
        response.send('Post added: ' + fields.id)
      })
    }
    //console.log('Done parsing form!');
    //response.writeHead(303, { Connection: 'close', Location: '/' }); redirect to home
    // response.end();
  });
  request.pipe(busboy);
  // busboy.end(request).rawBody); //this is for cloud functions
});

app.listen(process.env.PORT || 3000);
