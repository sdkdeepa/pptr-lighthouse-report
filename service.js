import express from "express";
import { createReportQueue, createReportStore, requestGenerateReport } from "./reports.js";
import assert from "assert";

const app = express();

// Allows us to grab these within our request handlers
app.locals.store = createReportStore();
app.locals.queue = createReportQueue(app.locals.store);

app.post("/report", express.json(), (request, response, next) => {
  if (!Array.isArray(request.body)) {
    return response.sendStatus(400); // Bad request, we expected an array
  }
  Promise.all(
      request.body.map(async ({ url, options }) => {
      assert(typeof url === "string", "Expected url to be provided");
         // We want to return an array for each item so we can match up the url
      return [
        url,
          await requestGenerateReport(
          request.app.locals.store,
          request.app.locals.queue,
          url,
          options
        ) 
      ];
    })
  )
      .then(identifiers => response.send(identifiers))
      // Catch any errors and allow express to handle it
      .catch(next);
});