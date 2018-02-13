var builder = require('botbuilder');


module.exports = [


    function(session) {
        // Add code for to check if user is authenticated and backend API authentication token in present session. If not invoke authentication flow

        session.send('Fetching your pending approvals....');


        //stubbed object - Need to fetch from backend API
        // Add code to invoke API.

        var leavesPending = [{ "leaveid": 1222769, "userAlias": "nimitg", "userName": "Sreekumar_avp", "comments": "Going on Vacation." }, { "leaveid": 9133257, "userAlias": "bsingh", "userName": "Shiju KOmath", "comments": "Need to go to passport office" }, { "leaveid": 9133893, "userAlias": "maniman", "userName": "Vimal kovath", "comments": "comp-off for release over weekend " }]

        var pwdResetFor = [{ "resetid": 1,"PasswordOf": ' System password', "employeeName":"Vimal k v","employeeId":"12229","comments": "Going on Vacation." }, 
                            { "resetid": 1,"PasswordOf": 'Hris password', "employeeName":"Vimal k v","employeeId":"12229", "comments": "Need to go to passport office" } ]

        // var message = new builder.Message()
        //     .attachmentLayout(builder.AttachmentLayout.carousel)
        //     .attachments(pwdResetFor.map(passwordResetFor));
        // session.send(message);

  var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments([
                new builder.HeroCard(session)
                    .title("Space Needle")
                    .text("The <b>Space Needle</b> is an observation tower in Seattle, Washington, a landmark of the Pacific Northwest, and an icon of Seattle.")
                    .images([
                        builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Seattlenighttimequeenanne.jpg/320px-Seattlenighttimequeenanne.jpg")
                            .tap(builder.CardAction.showImage(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Seattlenighttimequeenanne.jpg/800px-Seattlenighttimequeenanne.jpg")),
                    ])
                    .buttons([
                        builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/Space_Needle", "Wikipedia"),
                        builder.CardAction.imBack(session, "select:100", "Select")
                    ]),
           
                new builder.HeroCard(session)
                    .title("EMP Museum")
                    .text("<b>EMP Musem</b> is a leading-edge nonprofit museum, dedicated to the ideas and risk-taking that fuel contemporary popular culture.")
                    .images([
                        builder.CardImage.create(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Night_Exterior_EMP.jpg/320px-Night_Exterior_EMP.jpg")
                            .tap(builder.CardAction.showImage(session, "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Night_Exterior_EMP.jpg/800px-Night_Exterior_EMP.jpg"))
                    ])
                    .buttons([
                        builder.CardAction.openUrl(session, "https://en.wikipedia.org/wiki/EMP_Museum", "Wikipedia"),
                        builder.CardAction.imBack(session, "select:102", "Select")
                    ])
            ]);
      session.send(msg);

        session.endDialog();
    }

];

// Helpers
function leavesAsAttachments(reset) {
    return new builder.HeroCard()
        .title("Employee Id : " + leave.leaveid + ", Employee Name : " + leave.userName)
        .subtitle("Empoyee Comment: " + leave.comments)
        .buttons([
            builder.CardAction.dialogAction(null, "ApproveLeave", leave.leaveid, "Approve"),
            builder.CardAction.dialogAction(null, "RejectLeave", leave.leaveid, "Reject"),
        ]);
}

function passwordResetFor(reset) {
    return new builder.HeroCard()
        .title(reset.PasswordOf)
        .subtitle("Empoyee Comment: " + reset.comments)
        .text("resetid : " + reset.resetid +", Employee Name : " + reset.employeeName + ", Employee Id : " + reset.employeeId) 
        
        .buttons([
            builder.CardAction.dialogAction(null, "ApproveLeave", reset.PasswordOf, "Approve"),
            builder.CardAction.dialogAction(null, "RejectLeave", reset.PasswordOf, "Reject"),
        ]);
}