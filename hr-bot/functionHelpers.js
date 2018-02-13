var bot = require("./app.js"),
    VerEx = require('verbal-expressions');
//this is use in the line 44 of this code - do not remove
// is an object that contains one function
fun = {
    replyToMessageWith: function(replyMessage, session) {
        session.send(replyMessage);
    }
}

//Call this function if you want to remove something from a sentence
// Sentence: is the sentence you want to edit
// PHRASETOREPLACE: is the part of the sentence you want to change
// REPLACEPHRASEWITH: is what you want to replace the phrase with!
exports.removeThatPhrase = function(sentence, phraseToReplace, replacePhraseWith) {
    var phrase = sentence;
    var newSentence = VerEx().find(phraseToReplace).replace(sentence, replacePhraseWith);
    console.log(newSentence);
    return newSentence
}

//Create conditional responses for specified queries
exports.checkConditions = function(conditions, session, str) {
    for (var i in conditions) {
        if (conditions[i]) {
            session.send(str);
            return;
        }
    }
}

//Creat undconditional responses
exports.response = function(session) {
    var responseObject = {
        "how to use bot": "Enter '!help'",
        "wat": "Say what?",
        "lol": "roflmaotntpmp"
    };

    console.log("hi");

    var msg = session.message.text.toLowerCase();
    if (responseObject[msg]) {
        session.send(responseObject[msg]);
    }
}

//Use this function to reply to a message! Just put your reply in as the variable;)
exports.replyToMessageWith = function(replyMessage, session) {
    session.send(replyMessage);
}

//////////////**************Message Author function ***************/////////////////
// Move this function to is own file
exports.messageAuthor = function(session, prefix) {


var message=session.message;

    if (!message.text.startsWith(prefix))
        return;

    //!help displays all available commands
    let help = ["courses", "coupon"];

    if (message.text.startsWith(prefix + 'help')) {

        session.send("If you want to search stackoverflow.com put a '!S' in the beginning of your search.");
        session.send("If you want to search google.com put a '!G' in the beginning of your search.");
        session.send("If you want to search youtube.com put a '!Y' in the beginning of your search.");
        session.send("Here is a list of available commands:");

        for (var i in help) {
            session.send(prefix + help[i]);
        }
    }

    //!courses lists all courses in a message
    if (message.text.startsWith(prefix + 'courses')) {
        session.send("Here is a list of Devslopes courses:");
        session.send("https://www.udemy.com/devslopes-ios10/");
        session.send("https://www.udemy.com/sketch-design/");
        session.send("https://www.udemy.com/objectivec/");
        session.send("https://www.udemy.com/intermediate-ios/");
        session.send("https://www.udemy.com/learn-android/");
        session.send("https://www.udemy.com/apple-tv/");
        session.send("https://www.udemy.com/ios9-swift/");
        session.send("https://www.udemy.com/react-flux/");
        session.send("https://www.udemy.com/devslopes-unity3d/");
        session.send("https://www.udemy.com/mobile-design/");
        session.send("https://www.udemy.com/api-development/");
        session.send("https://www.udemy.com/angular2/");
    }

    //!coupon to display coupon for courses
    if (message.text.startsWith(prefix + 'coupon')) {
        session.send("iOS: http://bit.ly/2eu6XGC");
        session.send("Android: http://bit.ly/2flDQFk");
    }

} ////////// end Message Author function
