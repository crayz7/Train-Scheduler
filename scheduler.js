// Initialize Firebase
  var config = {
    apiKey: "AIzaSyDlwzLATOiDcbkg1jwJbLZAdhZMt45dQ4U",
    authDomain: "train-scheduler-62afb.firebaseapp.com",
    databaseURL: "https://train-scheduler-62afb.firebaseio.com",
    projectId: "train-scheduler-62afb",
    storageBucket: "",
    messagingSenderId: "782491632795"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  // Button for adding trains
  $("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var TrName = $("#name-input").val().trim();
  var TrDestination = $("#destination-input").val().trim();
  var TrTime = moment($("#time-input").val().trim(), "HH:mm").format("X");
  var TrFrequency = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: TrName,
    destination: TrDestination,
    time: TrTime,
    frequency: TrFrequency
  };

  // Uploads employee data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.time);
  console.log(newTrain.frequency);

  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#name-input").val("");
  $("#destination-input").val("");
  $("#time-input").val("");
  $("#frequency-input").val("");

  });

  // 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
  database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // Store everything into a variable.
  var TrName = childSnapshot.val().name;
  var TrDestination = childSnapshot.val().destination;
  var TrTime = childSnapshot.val().time;
  var TrFrequency = childSnapshot.val().frequency;

  // Employee Info
  console.log(TrName);
  console.log(TrDestination);
  console.log(TrTime);
  console.log(TrFrequency);

  // Calculating the next train arrival time and the minutes until it arrives
  var firstTrainMoment = moment(TrTime, "hh:mm").subtract(1, "years");
  var diffTime = moment().diff(moment(firstTrainMoment), "minutes");
  var remainder = diffTime % TrFrequency;
  var minUntilTrain = TrFrequency - remainder;
  var TrArrival = moment().add(minUntilTrain, "minutes");
  var TrArrivalPretty = TrArrival.format("HH:mm");

  // I took the above calculations from a supposed working example. I know next arrival needs to take into account the train's start time, current time, and frequency.
  // I don't know how to calculate that in moment.js. I've looked at .fromNow and .toNow but they don't appear to do what I need.

  // Here is what I orginially had but this does not take into account train start time.
  // var TrArrival = moment.unix().add(TrFrequency, "minutes");
  // console.log(TrArrival);
  // var TrArrivalPretty = TrArrival.format("HH:mm");

  // For calculating minutes away but logs "0"
  // var TrAway = moment.duration().minutes(TrArrival);
  // console.log(TrAway);

  // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + TrName + "</td><td>" + TrDestination + "</td><td>" +
  TrFrequency + "</td><td>" + TrArrivalPretty + "</td><td>" + minUntilTrain + "</td><td>");

  });