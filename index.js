const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const cookieparser = require("cookie-parser");
const bodyParser = require("body-parser");
const pool = require("./db/connection");
const patients = require("./routes/patients");
const doctors = require("./routes/doctors");
const diseases = require("./routes/diseases");
const rooms = require("./routes/rooms");
const users = require("./routes/users");
const register = require("./routes/register");
const login = require("./routes/login");
const logout = require("./routes/logout");

dotenv.config();

// app.use(cors({ origin: 'http://localhost:3000',
// credentials: true,
// exposedHeaders: ['Set-Cookie', 'Date', 'ETag'] }))
app.use(
  cors({
    origin: "*",
    credentials: true,
    exposedHeaders: ["Set-Cookie", "Date", "ETag"],
  })
);
// app.use(cors());
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cookieparser());

app.use("/patients", patients);
app.use("/doctors", doctors);
app.use("/diseases", diseases);
app.use("/rooms", rooms);
app.use("/users", users);
app.use("/signup", register);
app.use("/signin", login);
app.use("/logout", logout);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});

pool.connect();
