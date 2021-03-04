/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable camelcase */
const functions = require("firebase-functions");
const express=require("express");
const request=require("request");
const app=express();
const https=require("https");
const moment= require("moment-timezone");
const admin=require("firebase-admin");
admin.initializeApp();
const db=admin.database();

exports.main = functions.https.onRequest(app);
app.get("/", (_req, res)=>{
  res.status(200).json({
    name: "Dickson",
  });
});
exports.Loan_attempt=functions.database.ref("Att_Depo").onCreate((context, snapshot)=>{
  app.get("/yourname", _access_token, (req, res)=>{
    res.status(200).json({
      message: "hello stranger",
    });
  });
});

app.get("/access_toke", (_req, res)=>{
  const consumer_key="hLOFxsToHsXKR4pzTSVoYoAop3J93B7X";
  const consumer_secret="PjfnfGEnm7aVfGba";
  const url="https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

  const auth="Basic "+ new Buffer(consumer_key+":"+consumer_secret).toString("base64");


  request({
    url: url,
    headers: {
      "Authorization": auth,
    }}, (error, _response, _body)=>{
    if (error!==null) {
      res.json(error);
      console.log(error);
    } else {
      const fom=new Date().toLocaleString("en-US", {timeZone: "Africa/Nairobi"});
      const nope=moment.tz("Africa/Nairobi").format("YYYYMMDDHHmmss");
      const cool= new Date(fom);// .toISOString();
      const all=String(cool.getFullYear())+String(cool.getMonth()+1)+String(cool.getDate())+String(cool.getHours())+String(cool.getMinutes())+String(cool.getSeconds());
      const year =cool.getFullYear();
      res.status(200).json({
        "date": cool,
        "year": year,
        "all": nope,
      });
    }
  });
});


// eslint-disable-next-line require-jsdoc
function _access_token(req, res, next) {
  const consumer_key="hLOFxsToHsXKR4pzTSVoYoAop3J93B7X";
  const consumer_secret="PjfnfGEnm7aVfGba";
  const url="https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
  const auth="Basic "+ new Buffer(consumer_key+":"+consumer_secret).toString("base64");

  request({
    url: url,
    headers: {
      "Authorization": auth,
    }}, (error, response, body)=>{
    if (error!==null) {
      res.json(error);
      console.log(error);
    }
    req.access_token=(JSON.parse(body)).access_token;
    next();
  });
}


app.get("/yourname", _access_token, (req, res)=>{
  res.status(200).json({
    message: "hello stranger",
  });
});

app.get("/register", _access_token, (req, res)=>{
  const endpoint="https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl";

  request({
    method: "POST",
    url: endpoint,
    headers: {
      "Authorization": "Bearer " + req.access_token,
    }, json: {
      "ShortCode": "600000",
      "ResponseType": "Completed",
      "ConfirmationURL": "https://us-central1-blogzone-master-aa630.cloudfunctions.net/main/c2b/confirm",
      "ValidationURL": "https://us-central1-blogzone-master-aa630.cloudfunctions.net/main/c2b/validate",
    },
  }, (error, reponse, body)=>{
    if (error) {
      console.log(error);
      res.json(error);
    }
    res.status(200).json(body);
    console.log(body);
  });
});

app.post("/c2b/confirm", (req, res)=>{
  console.log(res.body);

  res.status(200).json({
    "ResultCode": 0,
    "ResultDesc": "Success",
  });

  db.ref("/comp").set(res.body);
});


app.post("/c2b/validate", (req, res)=>{
  console.log(res.body);
  res.status(200).json({
    "ResultCode": 0,
    "ResultDesc": "Success",
  });
  db.ref("/comp").set(res.body);
});


app.get("/c2b/validate", (req, res)=>{
  res.status(200).json({
    message: "it works",
  });
});
