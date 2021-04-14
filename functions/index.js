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
const moment= require("moment-timezone");
const admin=require("firebase-admin");
const cors=require("cors");
admin.initializeApp();
const db=admin.database();
app.use(cors({origin: true}));

exports.main = functions.https.onRequest(app);
app.get("/", (_req, res)=>{
  res.status(200).json({
    name: "Dickson",
  });
});
app.post("/random", (req, res)=>{
  console.log("the random post method works");
  console.log(req.body);
  res.send("random completed");
});


exports.Deposit_attempt=functions.database.ref("/Att_Depo/{pushId}").onCreate((snapshot, context )=>{
  const consumer_key="hLOFxsToHsXKR4pzTSVoYoAop3J93B7X";
  const consumer_secret="PjfnfGEnm7aVfGba";
  const keyy=snapshot.key;
  console.log(snapshot.val().phonenum);
  console.log(snapshot.val().amount);
  const phone=snapshot.val().phonenum;
  const num=phone.substr(1, 9);
  const PhoneNumber="254"+num;
  console.log(PhoneNumber);
  const url="https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
  const endpoint="https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
  const auth="Basic "+ new Buffer(consumer_key+":"+consumer_secret).toString("base64");
  const nope=moment.tz("Africa/Nairobi").format("YYYYMMDDHHmmss");
  const pword=new Buffer.from("174379"+"bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"+nope).toString("base64");

  let tokken="";
  axios({method: "get",
    url: url,
    headers: {
      "Authorization": auth,
    },
  }).then((response)=>{
    tokken=response.data.access_token;
    console.log(response.data.access_token);
    console.log("The data get has worked");


    request(
        {
          method: "POST",
          url: endpoint,
          headers: {
            "Authorization": "Bearer "+ response.data.access_token,
          },
          json: {
            "BusinessShortCode": "174379",
            "Password": pword,
            "Timestamp": nope,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": snapshot.val().amount,
            "PartyA": snapshot.val().phonenum,
            "PartyB": "174379",
            "PhoneNumber": PhoneNumber,
            "CallBackURL": "https://us-central1-blogzone-master-aa630.cloudfunctions.net/main/stk/lmstk",
            "AccountReference": snapshot.val().phonenum,
            "TransactionDesc": " look the web version works",
          },
        },
        function(error, respone, body) {
          if (error) {
            console.log(error);
          }

          db.ref("saf_deposit_req").child(keyy).set(body);
          console.log(body);
        }
    );
  }).catch((error)=>{
    console.log(error);
  });
  return null;
});

exports.Loan_attempt=functions.database.ref("/Att_Loan/{pushId}").onCreate((snapshot, context )=>{
  // db.ref("/yourname").set("cool bruh it works");
  // console.log(snapshot.val());
  const consumer_key="hLOFxsToHsXKR4pzTSVoYoAop3J93B7X";
  const consumer_secret="PjfnfGEnm7aVfGba";
  const url="https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
  const endpoint="https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest";
  const auth="Basic "+ new Buffer(consumer_key+":"+consumer_secret).toString("base64");
  const nope=moment.tz("Africa/Nairobi").format("YYYYMMDDHHmmss");
  const pword=new Buffer.from("174379"+"bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"+nope).toString("base64");
  let token="";
  axios({method: "get",
    url: url,
    headers: {
      "Authorization": auth,
    },
  }).then((response)=>{
    token=response.data.access_token;
    request({
      method: "POST",
      url: endpoint,
      headers: {
        "Authorization": "Bearer "+ response.data.access_token,
      }, json: {
        "InitiatorName": "apitest",
        "SecurityCredential": "Se0HgfA8WqRQ9WtQfKj9YjOSINYsQlUmojYlA40iIUxFAP4h8RgnJiG4AJ9A8suugSgWde+XVFolFa/bYg/+oms7tIanX1sYnaoFpIPuM2QTWNkkquo2YPJ/lpT+HKMDTisFjLA98g+lc1OyANEHTyxqi7iK/gJDbeGOe7mbNqaNOR6vnsQublR5tALJWjENW9Rmi3drpLtZLrdalym2YrCSkzqzoVPyp4tWNk/LS/7I4pBwuE5HjDx8Wu6n8Fee5J8QMlWckqxiITLe/1ap6EOlvpjW9fMy8Ir6Z97jaIirlUBe/NU3L1tOevx/GsFt0dXlCY4gn3g65STT4AYTTQ==",
        "CommandID": "BusinessPayment",
        "Amount": "2300",
        "PartyA": "600000",
        "PartyB": "254796142444",
        "Remarks": "You Won Nigga",
        "QueueTimeOutURL": "https://us-central1-blogzone-master-aa630.cloudfunctions.net/main/stk/lmstk",
        "ResultURL": "https://us-central1-blogzone-master-aa630.cloudfunctions.net/main/c2b/validate",
        "Occasion": "no occasion",
      }}, function(error, response, body) {
      if (error) {
        console.log(error);
      }
      console.log(body);
    });
  }).catch((error)=>{
    console.log(error);
  });
  const phone=snapshot.val().phonenum;
  const nm=phone.substr(1, 9);
  const PhoneNumber="254"+nm;
  console.log(PhoneNumber);
  return null;
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


app.post("/c2b/validate", (req, res, next)=>{
  console.log(".......validate........");
  console.log(req.body);
  res.status(200);
  // next();
});


app.get("/c2b/validate", (req, res)=>{
  console.log(req.body);
  res.status(200);
});

app.get("/stk", _access_token, (req, res)=>{
  const endpoint="https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
  const auth="Bearer "+req.access_token;
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
          "CallBackURL": "https://us-central1-blogzone-master-aa630.cloudfunctions.net/main/stk/lmstk",
          "AccountReference": " Dickson Obabo",
          "TransactionDesc": " look the web version works",
        },
      },
      function(error, response, body) {
        if (error) {
          console.log(error);
        }
        res.json(body);

        console.log(body);
      }
  );
});

app.post("/stk/lmstk", (req, res)=>{
  console.log(".............body..........");

  if (req.body.Body.stkCallback.ResultDesc=="Request cancelled by user") {
    db.ref("Att_Depo").limitToLast(1).on("value", (snapshot, context)=>{
      const cool=JSON.stringify(snapshot.val());

      const no=cool.split(":");
      const not =cool.split(",");
      const timestamp=not[2].toString().substring(12);

      console.log(not[3].toString().replace("}}", "").substring(9));
      const userid=not[3].toString().replace("}}", "").substring(9);


      const key=JSON.parse(no[0].substring(1));
      const am=no[1].toString().substring(1)+":"+no[2].toString();
      const an=am.split(",");
      const amount=an[0].split(":");

      const trans={"TransactionType": "Deposit",
        "Status": "Failed",
        "Amount": JSON.parse(amount[1].toString()),
        "userid": JSON.parse(userid),
        "Timestamp": JSON.parse(timestamp),
      };
      db.ref("saf_deposit_res").child(key).set(req.body.Body.stkCallback);
      db.ref("Transactions").child(key).set(trans);
    });
  } else if (req.body.Body.stkCallback.ResultDesc=="The service request is processed successfully.") {
    db.ref("Att_Depo").limitToLast(1).on("value", (snapshot, context)=>{
      const cool=JSON.stringify(snapshot.val());
      const no=cool.split(":");

      const key=JSON.parse(no[0].substring(1));
      console.log(key);

      const trans={"TransactionType": "Deposit",
        "Status": "Succeded",
        "Amount": "100"};

      db.ref("Transactions").child(key).set(trans);
    });
  }


  res.status(200);
});

