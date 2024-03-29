require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require('nodemailer');
const axios = require("axios");
const app = express();
const port = process.env.PORT || 603;

const base64 = require("js-base64").Base64;
const fetch = require("node-fetch");

// chat client
const StreamChat = require("stream-chat").StreamChat;
const chatClient = StreamChat.getInstance(
  "ch98smercfa4",
  "sadnv2yp4vgdzbf2pgbh3rnmwgdndp4x9vp3qmvvgfbrekuzy6mfnmghbtubxa9g"
);

// middleware
app.use(cors());

// heroku check
app.get("/", (req, res) => {
  res.status(200).send("OK");
});

// webhook handler
app.post("/", (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });
    
  // got payload from Stream
  req.on("end", async () => {
    let parsedBody = JSON.parse(body);
    console.log(parsedBody)
    // console.log('hello')
    let email = parsedBody.message.text
    pass = true
    if (
      // parsedBody.type === "channel.updated" &&
      // parsedBody.channel.sendToZendesk === true
      pass === true

    ) {
      // fetch channel messages from Stream
      const { channel_type, channel_id } = parsedBody;
      
      // channel_type = 'messaging';
      // channel_id = 'B';
      const channel = chatClient.channel(channel_type, channel_id);
      const sort = [{ last_message_at: -1 }]; 
      const state = await channel.query({ messages: { limit: 40 } }, sort);
      
      const { messages } = state;
      let lines = "";
      messages.forEach((mes) => (lines += `${mes.text} - ${mes.user.id} \n`));

      try {
        let transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'ryankavanaugh@getstream.io',
            // app password
            pass: 'gyna daem asst daek'
          }
        });

        let mailOptions = {
          from: 'ryankavanaugh@getstream.io',
          to: 'ryankavanaugh@getstream.io',
          subject: 'test',
          text: "Hi!" + "\n" + "You missed this message." + "\n \n"+ JSON.stringify(email)
        }
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
    res.status(200).send("OK");
  });
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
