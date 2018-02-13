// This loads the environment variables from the .env file
require('dotenv-extended').load();

var builder = require('botbuilder');
var restify = require('restify');
var functionHelper = require('./functionHelpers.js');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot and listen to messages
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});


var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());


//=========================================================
// Activity Events
//=========================================================

bot.on('conversationUpdate', function (message) {
   // Check for group conversations
    if (message.address.conversation.isGroup) {
        // Send a hello message when bot is added
        if (message.membersAdded) {
            message.membersAdded.forEach(function (identity) {
                if (identity.id === message.address.bot.id) {
                    var reply = new builder.Message()
                            .address(message.address)
                            .text("Hello everyone!");
                    bot.send(reply);
                }
            });
        }

        // Send a goodbye message when bot is removed
        if (message.membersRemoved) {
            message.membersRemoved.forEach(function (identity) {
                if (identity.id === message.address.bot.id) {
                    var reply = new builder.Message()
                        .address(message.address)
                        .text("Goodbye");
                    bot.send(reply);
                }
            });
        }
    }
});

bot.on('contactRelationUpdate', function (message) {
    if (message.action === 'add') {
        var name = message.user ? message.user.name : null;
        var reply = new builder.Message()
                .address(message.address)
                .text("Hello %s... Thanks for adding me. Say 'hello' to see some great demos.", name || 'there');
        bot.send(reply);
    } else {
        // delete their data
    }
});

bot.on('typing', function (message) {
    // User is typing
});

bot.on('deleteUserData', function (message) {
    // User asked to delete their data
});


//=========================================================
// Bots Middleware
//=========================================================

// Anytime the major version is incremented any existing conversations will be restarted.
bot.use(builder.Middleware.dialogVersion({ version: 1.0, resetCommand: /^reset/i }));

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', [
    function (session) {
        // Send a greeting and start the menu.
        var card = new builder.HeroCard(session)
            .title(" IT Help Desk Bot")
            .text("Your bots - wherever your users are talking.")
            .images([
                 builder.CardImage.create(session, "http://www.theoldrobots.com/images62/Bender-18.JPG")
        //    http://docs.botframework.com/images/demo_bot_image.png
            ]);
        var msg = new builder.Message(session).attachments([card]);
        session.send(msg);
        session.send("Hi... I'm IT Help Desk Bot . I can show you everything you need as in It services");
            session.replaceDialog('/carousel');
      
    },
    function (session, results) {
        // Always say goodbye
        session.send("Ok... See you later!");
    }
]);

bot.dialog('/menu', [
    function (session) {
        builder.Prompts.choice(session, "What demo would you like to run?", "cards|list|carousel|receipt|(quit)", { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
        if (results.response && results.response.entity != '(quit)') {
            // Launch demo dialog
            session.beginDialog('/' + results.response.entity);
        } else {
            // Exit the menu
            session.endDialog();
        }
    },
    function (session, results) {
        // The menu runs a loop until the user chooses to (quit).
        session.replaceDialog('/menu');
    }
]);

bot.dialog('/receipt', [



function (session) {
        session.send("Our Bot Builder SDK has a rich set of built-in prompts that simplify asking the user a series of questions. This demo will walk you through using each prompt. Just follow the prompts and you can quit at any time by saying 'cancel'.");
        builder.Prompts.text(session, "Prompts.text()\n\nEnter some text and I'll say it back.");
    },
    function (session, results) {
        if (results && results.response) {
            session.send("You entered '%s'", results.response);
            builder.Prompts.number(session, "Prompts.number()\n\nNow enter a number.");
        } else {
            session.endDialog("You canceled.");
        }
    },
    function (session, results) {
        if (results && results.response) {
            session.send("You chose '%s'", results.response.entity);
            builder.Prompts.confirm(session, "Prompts.confirm()\n\nSimple yes/no questions are possible. Answer yes or no now.");
        } else {
            session.endDialog("You canceled.");
        }
    },
    
    function (session) {
        session.send("You can send a receipts for purchased good with both images and without...");
        




        // Send a receipt with images
        var msg = new builder.Message(session)
            .attachments([
                new builder.ReceiptCard(session)
                    .title("Recipient's Name")
                    .items([
                        builder.ReceiptItem.create(session, "$22.00", "EMP Museum").image(builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/a/a0/Night_Exterior_EMP.jpg")),
                        builder.ReceiptItem.create(session, "$22.00", "Space Needle").image(builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/7/7c/Seattlenighttimequeenanne.jpg"))
                    ])
                    .facts([
                        builder.Fact.create(session, "1234567898", "Order Number"),
                        builder.Fact.create(session, "VISA 4076", "Payment Method"),
                        builder.Fact.create(session, "WILLCALL", "Delivery Method")
                    ])
                    .tax("$4.40")
                    .total("$48.40")
            ]);
        session.send(msg);

    }
]);
bot.dialog('/carousel', [
    function (session) {
        session.send("select any action  from this");
        
        // Ask the user to select an item from a carousel.
        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments([
                new builder.HeroCard(session)
                    .title("Reset Password")
                    .text("The <b>System password</b> You can click here to reset your password. Our bot will assist you to reset your password.")
                    .images([
                        builder.CardImage.create(session, "https://oneconsole.marlabs.com/static/home_new/images/Home-banner.jpg")
                            .tap(builder.CardAction.showImage(session, "https://oneconsole.marlabs.com/static/home_new/images/Home-banner.jpg")),
                    ])
                    .buttons([
                        builder.CardAction.openUrl(session, "https://oneconsole.marlabs.com/homepage/?next=/", "One Console"),
                        builder.CardAction.imBack(session, "select:100", "Select")
                    ]),
                new builder.HeroCard(session)
                    .title("Create Ticket")
                    .text("you can raise ticket regarding any issues ")
                     .images([
                        builder.CardImage.create(session, "https://oneconsole.marlabs.com/static/home_new/images/Home-banner.jpg")
                            .tap(builder.CardAction.showImage(session, "https://oneconsole.marlabs.com/static/home_new/images/Home-banner.jpg")),
                    ])
                    .buttons([
                        builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Pike_Place_Market", "Wikipedia"),
                        builder.CardAction.imBack(session, "select:101", "Select")
                    ]),
                new builder.HeroCard(session)
                    .title("Enquery")
                    .text("<b>About marlabs</b> hi you can ask any thing about marlabs")
                    .images([
                        builder.CardImage.create(session, "https://www.marlabs.com/sites/default/files//logo_0.png")
                            .tap(builder.CardAction.showImage(session, "https://www.marlabs.com/sites/default/files//logo_0.png"))
                    ])
                    .buttons([
                        builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Marlabs", "Marlabs"),
                        builder.CardAction.imBack(session, "select:102", "Select")
                    ])
            ]);


bot.dialog('/list', [
    function (session) {
        session.send("You can send the user a list of cards...");

        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    .title("Hero Card")
                    .subtitle("Space Needle")
                    .text("The <b>Space Needle</b> is an observation tower in Seattle, Washington, a landmark of the Pacific Northwest, and an icon of Seattle.")
                    .images([
                        builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Seattlenighttimequeenanne.jpg/320px-Seattlenighttimequeenanne.jpg")
                    ]),
                new builder.ThumbnailCard(session)
                    .title("Thumbnail Card")
                    .subtitle("Pikes Place Market")
                    .text("<b>Pike Place Market</b> is a public market overlooking the Elliott Bay waterfront in Seattle, Washington, United States.")
                    .images([
                        builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/2a/PikePlaceMarket.jpg/320px-PikePlaceMarket.jpg")
                    ])
            ]);
        session.endDialog(msg);
    }
]);



bot.dialog('/cards', [
    function (session) {
        session.send("You can use Hero & Thumbnail cards to send the user a visually rich information...");

        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    .title("Hero Card")
                    .subtitle("Space Needle")
                    .text("The <b>Space Needle</b> is an observation tower in Seattle, Washington, a landmark of the Pacific Northwest, and an icon of Seattle.")
                    .images([
                        builder.CardImage.create(session, "https://oneconsole.marlabs.com/static/home_new/images/Home-banner.jpg")
                    ])
                    .tap(builder.CardAction.openUrl(session, "https://oneconsole.marlabs.com/homepage/?next=/"))
            ]);
        session.send(msg);

        msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.ThumbnailCard(session)
                    .title("Thumbnail Card")
                    .subtitle("Pikes Place Market")
                    .text("<b>Pike Place Market</b> is a public market overlooking the Elliott Bay waterfront in Seattle, Washington, United States.")
                    .images([
                        builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/en/thumb/2/2a/PikePlaceMarket.jpg/320px-PikePlaceMarket.jpg")
                    ])
                    .tap(builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Pike_Place_Market"))
            ]);
        session.endDialog(msg);
    }
]);




        builder.Prompts.choice(session, msg, "select:100|select:101|select:102");
    },
    function (session, results) {
        if (results.response) {
            var action, item;
            var kvPair = results.response.entity.split(':');
            switch (kvPair[0]) {
                case 'select':
                    action = 'selected';
                    break;
            }
            switch (kvPair[1]) {
                case '100':
                    item = "the <b>reset password</b>";
                    break;
                case '101':
                    item = "<b>create ticket</b>";
                      session.replaceDialog('/receipt');
                    break;
                case '102':
                    item = "the <b>Other enquery</b>";
                    break;
            }
            session.endDialog('You %s "%s"', action, item);
        } else {
            session.endDialog("You canceled.");
        }
    }    
]);


bot.dialog('/signin', [ 
    function (session) { 
        // Send a signin 
        var msg = new builder.Message(session) 
            .attachments([ 
                new builder.SigninCard(session) 
                    .title("You must first signin to your account.") 
                    .button("signin", "http://example.com/") 
            ]); 
        session.endDialog(msg); 
    } 
]); 




bot.dialog('GetPendingApprovals', require('./GetPendingApprovals'));
bot.dialog('ResetPassword', require('./ResetPassword'));
bot.dialog('CreateRequest', require('./CreateRequest'));
bot.dialog('HRPolicies', require('./HRPolicies'));

bot.beginDialogAction("ApproveLeave", "/ApproveLeave");
bot.beginDialogAction("RejectLeave", "/RejectLeave");

//Approving Leave
bot.dialog('/ApproveLeave', [
    function(session, args) {
        session.dialogData.leaveId = args.data;
        builder.Prompts.text(session, 'Any Comments about this approval (type N/A for nothing)');
    },
    function(session, results, next) {
        session.send("approving leave....");
        // Add code to invoke API to approve request.
        session.endDialog("Leave Id : " + session.dialogData.leaveId + " Approved .");
        session.beginDialog('GetPendingApprovals');
    }
]);



//Reject Leave
bot.dialog('/RejectLeave', [
    function(session, args) {
        session.dialogData.leaveId = args.data;
        builder.Prompts.text(session, 'Any Comments about this Rejection (type N/A for nothing)');
    },
    function(session, results, next) {
        session.send("Rejecting leave....");
        // Add code to invoke API to reject request.
        session.endDialog("Leave Id : " + session.dialogData.leaveId + " Rejected .");
        session.beginDialog('GetPendingApprovals');
    }
]);


// log any bot errors into the console
bot.on('error', function(e) {
    console.log('And error ocurred', e);
});


//promts not using

bot.dialog('/prompts', [

    function (session) {
        session.send("Our Bot Builder SDK has a rich set of built-in prompts that simplify asking the user a series of questions. This demo will walk you through using each prompt. Just follow the prompts and you can quit at any time by saying 'cancel'.");
        builder.Prompts.text(session, "Prompts.text()\n\nEnter some text and I'll say it back.");
    },
    function (session, results) {
        if (results && results.response) {
            session.send("You entered '%s'", results.response);
            builder.Prompts.number(session, "Prompts.number()\n\nNow enter a number.");
        } else {
            session.endDialog("You canceled.");
        }
    },
    function (session, results) {
        if (results && results.response) {
            session.send("You entered '%s'", results.response);
            session.send("Bot Builder includes a rich choice() prompt that lets you offer a user a list choices to pick from. On Facebook these choices by default surface using buttons if there are 3 or less choices. If there are more than 3 choices a numbered list will be used but you can specify the exact type of list to show using the ListStyle property.");
            builder.Prompts.choice(session, "Prompts.choice()\n\nChoose a list style (the default is auto.)", "auto|inline|list|button|none");
        } else {
            session.endDialog("You canceled.");
        }
    },
    function (session, results) {
        if (results && results.response) {
            var style = builder.ListStyle[results.response.entity];
            builder.Prompts.choice(session, "Prompts.choice()\n\nNow pick an option.", "option A|option B|option C", { listStyle: style });
        } else {
            session.endDialog("You canceled.");
        }
    },
    function (session, results) {
        if (results && results.response) {
            session.send("You chose '%s'", results.response.entity);
            builder.Prompts.confirm(session, "Prompts.confirm()\n\nSimple yes/no questions are possible. Answer yes or no now.");
        } else {
            session.endDialog("You canceled.");
        }
    },
    function (session, results) {
        if (results && results.resumed == builder.ResumeReason.completed) {
            session.send("You chose '%s'", results.response ? 'yes' : 'no');
            builder.Prompts.time(session, "Prompts.time()\n\nThe framework can recognize a range of times expressed as natural language. Enter a time like 'Monday at 7am' and I'll show you the JSON we return.");
        } else {
            session.endDialog("You canceled.");
        }
    },
    function (session, results) {
        if (results && results.response) {
            session.send("Recognized Entity: %s", JSON.stringify(results.response));
            builder.Prompts.attachment(session, "Prompts.attachment()\n\nYour bot can wait on the user to upload an image or video. Send me an image and I'll send it back to you.");
        } else {
            session.endDialog("You canceled.");
        }
    },
    function (session, results) {
        if (results && results.response) {
            var msg = new builder.Message(session)
                .ntext("I got %d attachment.", "I got %d attachments.", results.response.length);
            results.response.forEach(function (attachment) {
                msg.addAttachment(attachment);    
            });
            session.endDialog(msg);
        } else {
            session.endDialog("You canceled.");
        }
    }

]);


bot.dialog('/picture', [
    function (session) {
        session.send("You can easily send pictures to a user...");
        var msg = new builder.Message(session)
            .attachments([{
                contentType: "image/jpeg",
                contentUrl: "http://www.theoldrobots.com/images62/Bender-18.JPG"
            }]);
        session.endDialog(msg);
        session.replaceDialog('/menu');
    }
]);
