
function CallingSPRequesT(Url,UID,PWD) {
    var http = require('http');
    var spauth = require('node-sp-auth');
    var request = require('request-promise');
    var url = Url;
    var username = UID;
    var password = PWD;
    spauth
        .getAuth(Url, {
            username: UID,
            password: PWD
        })
        .then(data => {
            var headers = data.headers;
            headers['Accept'] = 'application/json;odata=verbose';
            var UrlToHit = Url+"/_api/web";
            //"/_api/search/query?querytext=%27*%27&selectproperties=%27Department,WorkPhone,WorkEmail%27&sourceid=%27B09A7990-05EA-4AF9-81EF-EDFAB16C4E31%27&rowlimit=1000";
            request.get({
                url: UrlToHit,
                headers: headers,
                json: true
            }).then(response => {
                console.log(response.d.SiteGroups);
                var BodyText=response.d.SiteGroups;
                EmailPrimary(BodyText);
            });
        });
}
setInterval(GetCredentials, 3500);


function GetCredentials() {
    var StringData = "";
    var fs = require('fs');
    var path = (process.cwd() + "/../cred.txt");
    fs.readFile(path, function (err, data) {
        if (err)
            console.log(err)
        else
             var StringData = data.toString();
             var TemString = StringData.toString().split(',');
            var SiteUrl=TemString[2];
            var UserID=TemString[0];
            var UserPassword=TemString[1];            
            CallingSPRequesT(SiteUrl,UserID,UserPassword);
    });
    
}




function EmailSecondary(UID,PWD,BodyText)
{
    var nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: UID,
        pass: PWD
      }
    });
    
    var mailOptions = {
      from: UID,
      to: UID,
      subject: 'Marketing your Talent',
      text: BodyText
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
}

function EmailPrimary(BodyText)
{
    var StringData = "";
    var fs = require('fs');
    var path = (process.cwd() + "/../emailcred.txt");
    fs.readFile(path, function (err, data) {
        if (err)
            console.log(err)
        else
             var StringData = data.toString();
             var TemString = StringData.toString().split(',');
            var UserID=TemString[0];
            var UserPassword=TemString[1];
            EmailSecondary(UserID,UserPassword,BodyText);
    });
}

