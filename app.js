const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();

const port = 3000;

app.use(bodyParser.urlencoded({ extended:true }));
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', (req, res) => {
    let firstName = req.body.fName;
    let lastName = req.body.lName;
    let email = req.body.email;
    
    let data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    "FNAME": firstName,
	                "LNAME": lastName,
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = 'https://us2.api.mailchimp.com/3.0/lists/4cfc6a2e831';

    const options = {
        method: 'POST',
        auth: 'james1:494b2c0e7a39461360481b958426f6e2-us2'
    }

    const request = https.request(url, options, (response) => {

        if(response.statusCode === 200){
        response.on('data', (data) => {
            res.sendFile(__dirname + '/success.html')
        })
        } else {
        res.sendFile(__dirname + '/failure.html')
        }
    })

    request.write(jsonData);
    request.end();
});

app.post('/failure.html', function(req, res) {
    res.redirect('/');
})

app.listen(process.env.PORT || port, () => {
    console.log('listening on port ' + port);
});

// API 494b2c0e7a39461360481b958426f6e2-us2

// listID 4cfc6a2e83