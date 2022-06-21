var express = require("express");
var fs = require("fs");
var request = require("request");
var cheerio = require("cheerio");
var app = express();

app.get("/", function (req, res) {
  var url = "https://chaldal.com/fresh-fruit";  

  request(url, function (error, response, html) {
    if (!error) {
      var $ = cheerio.load(html);

      var name, qty, price, discountPrice;
      var json = {name: "", qty: "", price: "", discountPrice: ""};

      $(".productPane")
        .find(".productPane > div")
        .each(function (index, element) {
          console.log($(element));

          name = $(element).find(".product > div > .name").text().trim();
          json.name = name;
        
          qty = $(element).find(".product > div > .subText").text().trim();
          json.qty = qty;

          if($(element).find(".product > div.imageWrapper > div.price").length > 0){
            price = $(element).find(".product > div.imageWrapper > div.price").text().trim();
            json.price = price;

            json.discountPrice = "No discount";
          }

          if($(element).find("div.product > div.imageWrapper >  div.discountedPriceSection > div.discountedPrice").length > 0){
            price = $(element).find("div.product > div.imageWrapper > div.discountedPriceSection > div.price").text().trim();
            json.price = price;
  
            discountPrice = $(element).find("div.product > div.imageWrapper >  div.discountedPriceSection > div.discountedPrice").text().trim();
            json.discountPrice = discountPrice;
          }

          if (json.name != "") {
            fs.appendFile(
              "output.json",
              JSON.stringify(json, null, 4),
              function (err) {
                console.log(
                  "File successfully written! - Check your project directory for the output.json file"
                );
              }
            );
          }
        });
    }

    res.send(
      "File successfully written! - Check your project directory for the output.json file"
    );
  });
});


app.listen("8081");
console.log("Have a look at 8081");

exports = module.exports = app;
