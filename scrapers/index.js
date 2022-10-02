"use strict";

const ScraperFactory = require("../helpers/ScraperFactory");
const express = require("express");
const app = express();
const PORT = 8088;

const recipeScraper = async (url) => {
  let klass = new ScraperFactory().getScraper(url);
  return await klass.fetchRecipe();
};

app.use(express.json());

app.get("/recipe", async (req, res) => {
  // const { param } = req.params;
  const { url } = req.body;

  res.status(200).send({
    recipe: await recipeScraper(url),
  });
});

app.listen(PORT);
