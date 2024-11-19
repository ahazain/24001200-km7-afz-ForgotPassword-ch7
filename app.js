const config = require("./configs/config");
const session = require("express-session");
const path = require("path");
const express = require("express");
const Sentry = require("./configs/sentry");
const route = require("./routes/route");
const app = express();
const PORT = config.PORT;

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use("/", route);

app.use((req, res, next) => {
  console.log("Session token:", req.session.token);
  next();
});

app.use(Sentry.Handlers.errorHandler());

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`LOVE YOU ==> http://localhost:${PORT}`);
});
