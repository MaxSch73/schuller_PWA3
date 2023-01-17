const express = require('express');
const asyncHandler = require('express-async-handler');
const webpush = require('web-push');
require('dotenv').config();

const { getEmployees } = require('../model/employees');

const router = express.Router();

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

webpush.setVapidDetails(
  'mailto:robert.baumgartner@htlwienwest.at',
  publicVapidKey,
  privateVapidKey,
);

router.get(
  '/employees',
  asyncHandler(async (req, res) => {
    res.json(getEmployees());
  }),
);

const subscriptions = [];

router.post('/subscribe', (req, res) => {
  subscriptions.push(req.body);
  res.status(201).end();
});

router.post('/notify', (req, res) => {
  const payload = JSON.stringify({ title: 'Push Test', body: req.body });
  for (const sub of subscriptions) {
    try {
      webpush.sendNotification(sub, payload);
    } catch (error) {
      console.error(error);
    }
  }
  res.status(200).end();
});

module.exports = router;
