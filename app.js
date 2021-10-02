//require installed node packages
const express = require("express");
const https = require("https");

//create new express app
const app = express();

//enable express to access static files in the folder called "Public"
app.use(express.static("public"));

//use express to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

//send the signup page to the browser 
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/singup.html");
});

//post data from signup form to mailchimp
app.post("/", function(req, res) {

    //set up variables for input fields on html form 
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    //package info received from html form as a JSON in string form
    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    };
    const jsonData = JSON.stringify(data);

    //send authenticated data to mailchimp using Node's https package 
    const url = "https://us5.api.mailchimp.com/3.0/lists/your-code-here";
    const options = {
        method: "POST",
        auth: "bascur:your-code-here"
    }
    const request = https.request(url, options, function(response) {

        //Success and Failure pages
        if (response.statusCode == 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();
});

//Post request for Failure

app.post("/failure", function(req, res) {
    res.redirect("/");
})




//Server Up on heroku || local
app.listen(process.env.PORT || 3000, function() {
    console.log("Server up");
})
