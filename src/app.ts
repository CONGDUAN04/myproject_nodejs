// const express = require('express');
import express from "express";
import webRoutes from "src/routes/web"; // Import web routes
import initDatabase from "config/seed";
import passport from "passport";
import configPassportLocal from "src/middleware/passport.local";
import session from "express-session";
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 8080;

//config view engine
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
//config request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//config static files
app.use(express.static("public"));
//config session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}));
//config passport
app.use(passport.initialize());
app.use(passport.authenticate('session'));
configPassportLocal();
//config routes
webRoutes(app); // Use web routes
//seeding data
initDatabase();

//handle 404 not found (luôn đặt sau webRoutes)
app.use((req, res) => {
  res.send("404 Not found"); 
});


app.listen(PORT, () => {
  console.log(`My app is running on port: ${PORT}`);
});
