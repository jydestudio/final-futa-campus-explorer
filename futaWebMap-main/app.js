const express = require("express");
const path = require("path");
const fs = require("fs");
// const cors = require("cors");
// require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;


const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyAZLHFiKbHpPdBhDQNVWbmNnKdLy1NoPoc");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/ask-ai", async (req, res) => {
    const userQuestion = req.query.message.toLowerCase();  // Get the question from frontend
    const data = JSON.parse(fs.readFileSync("public/assets/shapefiles/uniform-names.json"))["uniformNames"]; // Load the JSON data
    // console.log(data["uniformNames"]);
    message = `
        you are playing the role of an ai agent for the federal university of tech akure, and your work is to check this data: ${data} 
        thoroughly and look for the uniform name that matches this prompt request: ${userQuestion}.
        Note: you are to strictly return one building name that matches the prompt request and 
        nothing more or less.
        if the prompt request is conversational and doesn't require a response from the data, then you
        must have a conversational response with the user.

    `

    const result = await model.generateContent(message);
    let friendlyIntro = await model.generateContent(`i want you to give me a very short and concise sentence that introduces this input: '${userQuestion}' response, make sure to use emoJI. you must strictly return something that matces, if the impute does make sense, just send back a greeting`);
    console.log(friendlyIntro.response.text())
    res.json({ reply: result.response.text(),  friendlyIntro: friendlyIntro.response.text()});
    console.log(result.response.text())

});



app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});