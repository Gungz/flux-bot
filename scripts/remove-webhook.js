const twitterWebhooks = require('twitter-webhooks');
const config = require('config');

if (process.argv.length < 3) {
    logger.info('usage node scripts/remove-webhook.js 1262086099217809408')
    return
}

const userActivityWebhook = twitterWebhooks.userActivity({
    ...config.TwitterWebhookEnv
});

//Register your webhook url - just needed once per URL
userActivityWebhook.unregister({webhookId: process.argv[2]}).catch(err => { console.error ("Error when unregister webhook " + JSON.stringify(err)) });