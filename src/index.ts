//! THIS FILE NOT REALLY MEAN SOMETHING THE API IS WHAT DO THE JOB
import fs from 'node:fs';
import express from 'express';

const app = express();
app.use(express.static('.'));

const listener = app.listen(3000, function () {
  console.log('Your app is listening on port ' + 3000);
});
