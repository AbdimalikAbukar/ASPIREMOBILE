const express = require("express");
const router = express.Router();
const axios = require("axios");

const category = "inspirational";

const apiUrl = `https://api.api-ninjas.com/v1/quotes?category=${category}`;

router.get("/", async (req, res) => {
  try {
    const response = await axios.get(apiUrl, {
      headers: { "X-Api-Key": process.env.API_KEY },
    });

    console.log("API Response:", response.data);

    const quoteData = response.data[0];
    const quote = quoteData?.quote || "Stay inspired!";
    const author = quoteData?.author || "Unknown";

    console.log("Rendered Data:", { quote, author });

    res.json({
      quote,
      author,
    });
  } catch (error) {
    console.error("Error fetching quote:", error.message);

    res.json({
      quote: "An error occurred while fetching the quote.",
      author: "",
    });
  }
});
module.exports = router;
