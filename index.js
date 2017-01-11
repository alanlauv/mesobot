var SlackBot = require('slackbots');
var request = require('request');
var fs = require('fs');

// create a bot 
var bot = new SlackBot({
    token: fs.readFileSync('token').toString(),
    name: 'Meso Bot'
});
 
// more information about additional params https://api.slack.com/methods/chat.postMessage 
var params = {
    icon_url: 'https://avatars.slack-edge.com/2017-01-11/125963055763_2dab9f95b7c28ff6fa55_72.png'
};

bot.on('start', function() {
    
    // define channel, where bot exist. You can adjust it there https://my.slack.com/services  
    bot.postMessageToChannel('test', 'Meso bot says hello!', params);
});

bot.on('message', function(data) {
    console.log(data);
    console.log("--------------------");
    switch(data.type) {
        case 'message':
            console.log("DM was sent from user: " + data.user + " with message: " + data.text);
            let payload = { token: this.token, user: data.user };
            let r = request(
                {
                    url: 'https://slack.com/api/users.info',
                    qs: payload
                },
                function(error, response, raw) {
                    if (!error && response.statusCode == 200) {
                        var body = JSON.parse(raw);
                        if (body.ok === true) {
                            console.log("FOUND USERNAME");
                            console.log(body.user.name);
                            bot.postMessageToUser(body.user.name, 'Command ' + data.text + ' is not supported!', params);
                        }
                    }
                    else {
                        console.log(error);
                        return;
                    }
                });
            return;
        default:
            return;
    }
});