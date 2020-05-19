const express = require ('express');
const bodyParser = require ('body-parser');
const twitterWebhooks = require('twitter-webhooks');
const config = require('config');
const Twit = require('twit');
const T = new Twit(config.Twit);
const atob = require('atob');
const moment = require('moment');

const {
  keyStores
} = require('near-api-js');

//Flux initialization and connection
const Flux = require('flux-sdk');
const CONTRACT_ID = "fluxprotocol-phase-point-two";
const fluxInstance = new Flux();

(async () => {
  await fluxInstance.connect(CONTRACT_ID, new keyStores.UnencryptedFileSystemKeyStore("neardev"), process.env.NEAR_ACCOUNT_ID);
})();

const app = express();
app.use(bodyParser.json());

//Initiate TwitterWebhook
const userActivityWebhook = twitterWebhooks.userActivity({
    ...config.TwitterWebhookEnv, 
    app
});

//Function to handle user activity event
const handleMention = (data) => {
  //console.log ('tweet_create ' + JSON.stringify(data))
  const { in_reply_to_user_id_str, id_str, user, text } = data;
  if(in_reply_to_user_id_str === process.env.TWITTER_USER_ID) {
    const txtArr = text.split('"');
    const endTime = moment.utc(txtArr[2].trim(), 'DD-MM-YYYY hh:mma').valueOf();
    //console.log("End Time: " + endTime);
    fluxInstance.createBinaryMarket(txtArr[1].trim(), "@BotHackathon", [], endTime, 0)
    .then(txRes => {
      //console.log("tx: " + txRes);
      const id = atob(txRes.status.SuccessValue);
      //console.log("ID:" + id);
      var replyText = `@${user.screen_name}, Market with id ${id} is successfully created`;
      T.post('statuses/update', { status: replyText, in_reply_to_status_id: id_str, auto_populate_reply_metadata: true }, tweeted);
      // Make sure it worked!
      function tweeted(err, reply) {
        if (err) {
          console.log(err.message);
        } else {
          console.log('Tweeted: ' + reply.text);
        }
      }
    });
  }
};

//Register your webhook url - just needed once per URL
userActivityWebhook.register()
.then(res => {
  //Subscribe for a particular user activity
  const args = config.TwitterWebhookSubscribedUser;
  userActivityWebhook.subscribe(args)
  .then(function (userActivity) {
      userActivity
      .on ('tweet_create', handleMention)
  })
  .catch(err => {
    console.error ("Error when creating subscription: " + JSON.stringify(err));
    const userActivity = userActivityWebhook.getUserActivity(args);
    userActivity
      .on ('tweet_create', handleMention)
  });
})
.catch(err => { 
  console.error ("Error when register " + JSON.stringify(err)) 
  const args = config.TwitterWebhookSubscribedUser;
  userActivityWebhook.subscribe(args)
  .then(function (userActivity) {
      userActivity
      .on ('tweet_create', handleMention)
  })
  .catch(err => {
    console.error ("Error when creating subscription: " + JSON.stringify(err));
    const userActivity = userActivityWebhook.getUserActivity(args);
    userActivity
      .on ('tweet_create', handleMention)
  });
});

//listen to unknown payload (in case of api new features)
userActivityWebhook.on ('unknown-event', (rawData) => console.log (rawData));

app.listen(3000, function() {
  console.log('Node app is running on port 3000')
});