/* eslint-disable new-cap */
/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable camelcase */

const functions = require("firebase-functions");
const express=require("express");
const axios=require("axios").default;
const request=require("request");
const app=express();
const https=require("https");
const moment= require("moment-timezone");
const admin=require("firebase-admin");
admin.initializeApp();
const db=admin.database();
const consumer_key="hLOFxsToHsXKR4pzTSVoYoAop3J93B7X";
const consumer_secret="PjfnfGEnm7aVfGba";
const auth="Basic "+ new Buffer(consumer_key+":"+consumer_secret).toString("base64");


exports.main = functions.https.onRequest(app);
app.get("/", (_req, res)=>{
  res.status(200).json({
    name: "Dickson",
  });
});
const authoptions={
  host: "sandbox.safaricom.co.ke",
  path: "/oauth/v1/generate?grant_type=client_credentials",
  headers: {
    "Authorization": auth,
  },
  method: "GET",
};


exports.Loan_attempt=functions.database.ref("/Att_Depo/{pushId}").onCreate((context, snapshot)=>{
  
  const consumer_key="hLOFxsToHsXKR4pzTSVoYoAop3J93B7X";
  const consumer_secret="PjfnfGEnm7aVfGba";
  const url="https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
  const auth="Basic "+ new Buffer(consumer_key+":"+consumer_secret).toString("base64");
  
  axios({method: "get",
    url: url,
    headers: {
      "Authorization": auth,
    },
  }).then((response)=>{
    console.log(response.data);
    console.log("The data get has worked");
  }).catch((error)=>{
    console.log(error);
  });


});

exports.attampts=functions.database.ref("/Att_Depo").onCreate((context, snapshot)=>{
  db.ref("/yourname").set("cool bruh it works");
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





function getToken(req, res, next) {
  const consumer_key="hLOFxsToHsXKR4pzTSVoYoAop3J93B7X";
  const consumer_secret="PjfnfGEnm7aVfGba";
  const url="https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
  const auth="Basic "+ new Buffer(consumer_key+":"+consumer_secret).toString("base64");
  const authOptions = {
    host: "sandbox.safaricom.co.ke",
    path: "/oauth/v1/generate?grant_type=client_credentials",
    headers: {
      "Authorization": auth,
    },
    method: "GET",
  };

  const token= https.request(authOptions, (response)=>{
    const data=[];
    response.on("data", (chunk)=>{
      data.push(chunk);
      return chunk;
    });
  }).on("finish", (rata)=>{
    console.log(rata);
  });

  // request({
  //   url: url,
  //   headers: {
  //     "Authorization": auth,
  //   }}, (error, response, body)=>{
  //   if (error!==null) {
  //     res.json(error);
  //     console.log(error);
  //   }
  //   token=(JSON.parse(body)).access_token;
  //   req.access_token=(JSON.parse(body)).access_token;
  //   next();
  // });
  // return token;
  // console.log(token);
}

const coolPromise = new Promise((resolve, reject) =>{

  // this was created by jason.
});


function cooltrial(req, res, next) {
  let token="";
  const url="https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
  request({
    url: url,
    headers: {
      "Authorization": auth,
    }}, (error, response, body)=>{
    if (error!==null) {
      res.json(error);
      console.log(error);
    }

    console.log(JSON.parse(body).access_token);
    token=JSON.parse(body).access_token;
    // req.access_token=(JSON.parse(body)).access_token;

    request({
      method: "POST",
      url: endpoint,
      headers: {
        "Authorization": "Bearer " + token,
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
    next();
  });
  const endpoint="https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl";

  request({
    method: "POST",
    url: endpoint,
    headers: {
      "Authorization": "Bearer " + token,
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
}

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
app.get("/stk", _access_token, (req, res)=>{
  const endpoint="https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
  const auth="Bearer "+getToken();
  const fom=new Date().toLocaleString("en-US", {timeZone: "Africa/Nairobi"});
  const cool= new Date(fom);// .toISOString();
  const all=String(cool.getFullYear())+String(cool.getMonth()+1)+String(cool.getDate())+String(cool.getHours())+String(cool.getMinutes())+String(cool.getSeconds());
  const year =cool.getFullYear();
  const nope=moment.tz("Africa/Nairobi").format("YYYYMMDDHHmmss");
  const pword=new Buffer.from("174379"+"bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"+nope).toString("base64");
  request(
      {
        method: "POST",
        url: endpoint,
        headers: {
          "Authorization": auth,
        },
        json: {
          "BusinessShortCode": "174379",
          "Password": pword,
          "Timestamp": nope,
          "TransactionType": "CustomerPayBillOnline",
          "Amount": "2",
          "PartyA": "254796142444",
          "PartyB": "174379",
          "PhoneNumber": "254796142444",
          "CallBackURL": "https://us-central1-blogzone-master-aa630.cloudfunctions.net/main/lmstk",
          "AccountReference": " Dickson Obabo",
          "TransactionDesc": " look the web version works",
        },
      },
      function(error, response, body) {
        console.log(error);
        console.log(all);
        // TODO: Use the body object to extract the response
        console.log(body);
      }
  );
});

app.get("/stk2", gttoken, (req, res)=>{
  // getToken();
  let tt="";
  gttoken().then((response)=>{
    // console.log(response.access_token);
    // num=response;

    tt=response;
    console.log(response);
    // res.send(response);
  });

  res.send(tt);
  // console.log(num);
  // res.send(num);
});

app.post("/lmstk", (req, res)=>{
  console.log(req.body);
});
