const express = require("express");
const mongoose = require("mongoose");
const app = express();
var bodyParser = require("body-parser");
require("dotenv").config();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const axios = require("axios");
var beep = require("beepbeep");

// Twillio thing
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const fire_message_with_twilio = async (phone_number, course) => {
  try {
    const message = await client.messages.create({
      body: `${course} has a spot`,
      from: process.env.SENDER_PHONE_NUMBER,
      to: phone_number,
    });
    console.log("Sending Succeeds!");
  } catch (e) {
    console.log(e);
  }
};
async function fire_notification_locally(phoneNum, courseName) {
  console.log(`${courseName} has a spot`);
  beep(6);
}
const parseCourse = (courseString) => {
  res = [];
  for (let i = 0; i < courseString.length; i++) {
    let pos = 0;
    if (courseString[i] >= "0" && courseString[i] <= "9") {
      pos = i;
      res.push(courseString.slice(0, pos));
      res.push(courseString.slice(pos, courseString.length));
      break;
    }
  }
  return res;
};
const sendNotificationToAllEntries = async () => {
  console.log("Checking...");
  allEntries = await Course.find();
  for (let i = 0; i < allEntries.length; i++) {
    phoneNum = allEntries[i].phoneNum;
    courseTuple = parseCourse(allEntries[i].course);
    courseName = courseTuple[0];
    courseCode = courseTuple[1];

    const res = await axios.get(`${process.env.COURSE_API}`, {
      params: { courseName: courseName, courseCode: courseCode },
    });
    if (res.data.hasSpot) {
      fire_notification_locally(phoneNum, courseName + courseCode);
    } else {
      console.log(courseName + courseCode + " has no spot currently");
    }
  }
};

// MongoDB setup
mongoose.set("strictQuery", false);

mongoose
  .connect("mongodb://localhost:27017/myDB")
  .catch((err) => console.log(err));
const courseSchema = mongoose.Schema({
  course: String,
  phoneNum: String,
});
const Course = mongoose.model("Course", courseSchema);

app.get("/", (req, res) => {
  res.send("express is here");
});
app.post("/create", (req, res) => {
  Course.create({
    course: req.body.course,
    phoneNum: req.body.phoneNum,
  })
    .then((doc) => console.log(doc))
    .catch((err) => console.log(err));
});
app.get("/courses", (req, res) => {
  Course.find()
    .then((items) => res.json(items))
    .catch((err) => console.log(err));
});
app.delete("/delete/:id", (req, res) => {
  Course.findByIdAndDelete({ _id: req.params.id })
    .then((doc) => console.log(doc))
    .catch((err) => console.log(err));
});
app.listen(3001, function () {
  console.log("Server running");
  let timeInterval = 30000;
  setInterval(() => sendNotificationToAllEntries(), timeInterval);
});
