//Create a basic Node.js server
import express from "express";
import dotenv from "dotenv";
import bodyparser from "body-parser";

import path from "path";
import { loginRedirect, callbackHandler } from "./authentication/auth";
import { ConnectorStore } from "./connectorStore/store";
import { ConfigConstant } from "./constant/configConstant";
const https = require('https');
const app = express();
app.set('view engine', 'ejs');
app.use(bodyparser.json());

dotenv.config();

const store = new ConnectorStore;

app.get("/", (req,res) => {
    //Send out the configuration page of the connector
    res.sendFile(path.join(__dirname,"..","assets","config.html"));
})

app.post("/configDetails", (req,res) => {
  let details = req.body;
  store.set(details);

  const data = JSON.stringify(store.getAll());

  const options = {
    hostname: ConfigConstant.Login_URL,
    port: 443,
    path: ConfigConstant.SAVE_Mapping_Data,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
      'X-Authorization':ConnectorStore.getToken()
    }
  }
  const post_req = https.request(options, function(res){
    console.log(`statusCode: ${res.statusCode}`)
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log('Response: ' + chunk); })
  })
  
  req.on('error', (error) => {
    console.error(error)
  })
  
  post_req.write(data)
  post_req.end()

  res.send();
  
})




//This demo implements server-side login and doesn't pass any information to the client
app.get("/login", (req,res) => {
    loginRedirect(res);
})

//This endpoint will receive the code with which it can request user information
app.get(process.env.REDIRECT_URL || "/callback", (req, res) => {
    callbackHandler(req,res);
  });

app.listen(8000, () => {
    console.log("Server running!");
})