"use strict";

const BaseScraper = require("../helpers/BaseScraper");

/**
 * Class for scraping lamaistas.lt
 * @extends BaseScraper
 */
class LaMaistasScraper extends BaseScraper {
  constructor(url) {
    super(url, "lamaistas.lt/receptas/");
  }

  scrape($) {
    this.defaultSetImage($);
    this.defaultSetDescription($);
    const { ingredients, instructions } = this.recipe;

    this.recipe.name = $("meta[property='og:title']").attr("content");
    // const tags = $("span[name='keywords']").attr("content");

    // this.recipe.tags = tags ? tags.split(",") : [];

    const tags = $('div[class="guidelinesSegment"]').children("a");

    const tagArray = [];

    tags.each((i, el) => {
      tagArray.push(`${$(el).text()}`);
    });

    this.recipe.tags = tags ? tagArray : [];

    const container = $('div[class="ingredients"]');
    const ingredientsContainer = container.children('div[class="infoA"]');
    const ingredientsTableContainer = ingredientsContainer.children("table");
    const ingredientsTableBodyContainer =
      ingredientsTableContainer.children("tbody");
    const ingredientsTableBodyTrContainer =
      ingredientsTableBodyContainer.children("tr");
    const ingredientsTableBodyTrTdContainer =
      ingredientsTableBodyTrContainer.children("td");
    const units = ingredientsTableBodyTrTdContainer.children(
      'span[class="amount"]'
    );
    const ingrDivs = ingredientsTableBodyTrTdContainer.children(
      'span[class="ingredient"]'
    );

    units.each((i, el) => {
      ingredients.push(
        `${$(el)
          .text()
          .replace(/\r?\n|\r/g, "")} ${$(ingrDivs[i])
          .text()
          .replace(/\r?\n|\r/g, "")}`
      );
    });

    const instructionContainer = $('div[class="method"]');
    const instructionMethodContainer = instructionContainer
      .children('div[class="infoA"]')
      .children('div[class="description"]');

    const prepTime = instructionContainer
      .children('div[class="info"]')
      .children('span[class="info"]')
      .text();

    this.recipe.time.prep = prepTime;

    instructionMethodContainer.find('div[class="text"]').each((i, el) => {
      instructions.push($(el).text());
    });

    this.recipe.servings = container
      .children('div[class="info"]')
      .children('div[class="portionContainer"]')
      .children("span")
      .text()
      .split(" ")[0];
  }
}

module.exports = LaMaistasScraper;
