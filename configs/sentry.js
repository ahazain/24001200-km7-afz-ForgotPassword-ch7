require("dotenv").config();
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
const express = require("express");
const app = express();
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  integrations: [new Tracing.Integrations.Express({ app })],
});

module.exports = Sentry;
