// const express = require('express');
import express from "express";
import webRoutes from "./routes/web"; // Import web routes
import initDatabase from "config/seed";
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
//config routes
webRoutes(app); // Use web routes
//seeding data
initDatabase();
app.listen(PORT, () => {
  console.log(`My app is running on port: ${PORT}`);
});
