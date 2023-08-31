// import express from 'express';
// import bodyParser from 'body-parser';
// import admin from 'firebase-admin';

const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

// Add your own service account file
// https://firebase.google.com/docs/app-distribution/authenticate-service-account?platform=ios
// This is mapped to nmuralidharan@retisio.com under firebase-test project
const serviceAccount = require('../fir-test-a3fe8-firebase-adminsdk-8a7ko-7070eb4274.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://fir-test-a3fe8-default-rtdb.asia-southeast1.firebasedatabase.app' // Replace with your Firebase project URL
});

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Endpoint to send alerts/notifications
app.post('/send-notification', (req, res) => {
  const { userId, message } = req.body;

  if (!userId || !message) {
    return res.status(400).json({ error: 'User ID and message are required' });
  }

  // Store notification in Firebase Realtime Database
  const notificationsRef = admin.database().ref(`notifications/${userId}`).push();
 
  notificationsRef.set({
    timestamp: Date.now(),
    
    details: message
  })
  .then(() => {
    res.json({ success: true, message: 'Notification sent successfully' });
  })
  .catch((error) => {
    res.status(500).json({ error: 'Failed to send notification' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
