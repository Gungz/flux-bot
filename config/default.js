module.exports =
{
    TwitterWebhookEnv: {
        serverUrl: process.env.WEBHOOK_SERVER_URL,
        route: process.env.WEBHOOK_ROUTE,
        consumerKey: process.env.APPLICATION_CONSUMER_KEY,
        consumerSecret: process.env.APPLICATION_CONSUMER_SECRET,
        accessToken: process.env.ACCESS_TOKEN,
        accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
        environment: process.env.ENVIRONMENT, 
    },
    TwitterWebhookSubscribedUser: {
        userId: process.env.TWITTER_USER_ID,
        accessToken: process.env.ACCESS_TOKEN,
        accessTokenSecret: process.env.ACCESS_TOKEN_SECRET
    },
    Twit: {
        consumer_key: process.env.APPLICATION_CONSUMER_KEY,
        consumer_secret: process.env.APPLICATION_CONSUMER_SECRET,
        access_token: process.env.ACCESS_TOKEN,
        access_token_secret: process.env.ACCESS_TOKEN_SECRET
    }
}