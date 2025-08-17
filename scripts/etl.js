// filepath: /Users/jaimediaz/Labs/website-realstate-v3/scripts/etl.js
const fs = require("fs");
const csv = require("csv-parser");
const { default: next } = require("next");

const results = [];

fs.createReadStream(`${__dirname}/data.csv`)
  .pipe(csv())
  .on("data", (data) => {
    if (!data.LATITUDE || !data.LONGITUDE) {
      console.warn(`Skipping entry due to missing coordinates`, data);
      return;
    }

    const place = {
      type: data["PROPERTY TYPE"],
      address: data.ADDRESS,
      city: data.CITY,
      state: data["STATE OR PROVINCE"],
      zip: parseInt(data["ZIP OR POSTAL CODE"]),
      price: parseFloat(data.PRICE),
      beds: parseInt(data.BEDS),
      baths: parseFloat(data.BATHS),
      squareFeet: parseFloat(data["SQUARE FEET"]),
      yearBuilt: parseInt(data["YEAR BUILT"]),
      daysOnMarket: parseFloat(data["DAYS ON MARKET"]),
      priceSquareFoot: parseFloat(data["$/SQUARE FEET"]),
      hoaMonth: parseFloat(data["HOA/MONTH"]),
      status: data.STATUS === "Active",
      nextOpenHouseStartTime: data["NEXT OPEN HOUSE START TIME"],
      nextOpenHouseEndTime: data["NEXT OPEN HOUSE END TIME"],
      url: data[
        "URL (SEE https://www.redfin.com/buy-a-home/comparative-market-analysis FOR INFO ON PRICING)"
      ],
      latitude: parseFloat(data.LATITUDE),
      longitude: parseFloat(data.LONGITUDE),
      mlsId: parseFloat(data["MLS#"]),
    };
    results.push(place);
  })
  .on("end", () => {
    console.log(`${results.length} entries processed successfully.`);

    fs.writeFile(
      `${__dirname}/../public/places.json`,
      JSON.stringify(results, null, 2),
      (err) => {
        if (err) {
          console.error("Error writing to JSON file:", err);
        } else {
          console.log("Results saved to output.json");
        }
      }
    );
  })
  .on("error", (err) => {
    console.error("Error reading the CSV file:", err);
  });
