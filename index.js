var SlackBot = require('slackbots');
var request = require('request');
var fs = require('fs-extra');
var _ = require("underscore");

var currentPath = './';
var fileNames;
var newFileNames;

var bot = new SlackBot({
    token: fs.readFileSync('token').toString(),
    name: 'Meso Bot'
});

var params = {
    icon_url: 'https://avatars.slack-edge.com/2017-01-11/125963055763_2dab9f95b7c28ff6fa55_72.png'
};

bot.on('start', function() {
    bot.postMessageToChannel('test', 'Meso bot says hello!', params);
});

function watch() {
    var newFileNames = fs.readdirSync(currentPath);
    if (fileNames && newFileNames.length > fileNames.length) {
        var diff = _.difference(newFileNames, fileNames);
        _.each(diff, function(fileName) {
            if (fileName.startsWith("screenshot") && fileName.endsWith(".png")) {
                bot.postMessageToChannel('test', 'Screenshot created: ' + fileName, params);
                uploadScreenShot(fileName);
            }
        });
    }
    fileNames = newFileNames;
}

setInterval(watch, 5000);

function uploadScreenShot(fileName) {
    request.post({
        url: 'https://slack.com/api/files.upload',
        formData: {
            token: bot.token,
            title: "Screenshot",
            filename: fileName,
            channels: "test",
            file: fs.createReadStream(fileName),
        },
    }, function (error, response, raw) {
        if (!error && response.statusCode == 200) {
            var body = JSON.parse(raw);
            if (body.ok === true) {
                console.log("Upload OK");
            }
        }
        else {
            console.log(error);
            return;
        }
    });
}