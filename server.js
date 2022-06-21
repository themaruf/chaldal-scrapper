const express = require('express')
const fs = require('fs')
const request = require('request')
const cheerio = require('cheerio')
const app = express()

app.get('/', function (req, res) {
  const url = 'https://chaldal.com/meat' //Enter the url of the product list URL you want to scrape.

  request(url, function (error, response, html) {
    if (!error) {
      const $ = cheerio.load(html)

      let name, qty, price, discountPrice
      const json = { name: '', qty: '', price: '', discountPrice: '' }

      $('.productPane')
        .find('.productPane > div')
        .each(function (index, element) {
          // console.log($(element))

          name = $(element).find('.product > div > .name').text().trim()
          json.name = name

          qty = $(element).find('.product > div > .subText').text().trim()
          json.qty = qty

          discountPrice = $(element)
            .find(
              '.product > div >  div.discountedPriceSection > div.discountedPrice'
            )
            .text()
            .trim()
          //check discount price is present or not
          if (discountPrice === '') {
            json.discountPrice = 'No Discount'
            //if the discount price empty, set main price
            price = $(element).find('.product > div >  div.price').text().trim()
            json.price = price
          } else {
            //if the discount price not empty, set discount price & actual price
            const actualPrice = $(element)
              .find('.product > div > div.discountedPriceSection > div.price')
              .text()
              .trim()
            json.price = actualPrice
            json.discountPrice = discountPrice
            console.log(discountPrice)
          }

          if (json.name != '') {
            fs.appendFile(
              'output.json',
              JSON.stringify(json, null, 4),
              function (err) {
                console.log(
                  'File successfully written! - Check your project directory for the output.json file'
                )
              }
            )
          }
        })
    }

    res.send(
      'File successfully written! - Check your project directory for the output.json file'
    )
  })
})

app.listen('8081') // Server port, if need you can change it.
console.log('Have a look at 127.0.0.1:8081')

exports = module.exports = app
