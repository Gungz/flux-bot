# Flux Bot
A Twitter bot that creates market when it is tagged in the tweet.

This is created to fulfill use-case mentioned in [Gitcoin Hackathon](https://gitcoin.co/issue/nearprotocol/ready-layer-one-hackathon/8/4311)
A Twitter bot that allows people to create a market by tagging a bot. E.g.: @flux_bot "Will Donald Trump be re-elected in 2020?" 31-12-2020 11:59pm

## Prerequisite (has been tested with version mentioned below)
1. Node v10.15.x
2. [NearShell](https://docs.near.org/docs/development/near-clitool) v0.23.2
3. A [Near Account](https://docs.near.org/docs/local-setup/create-account) in TestNet
4. A [Twitter Developer Account](https://developer.twitter.com/en)

### Twitter Application Creation
1. Login to your [Twitter Developer Account](https://developer.twitter.com/en)
2. Create [new apps](https://developer.twitter.com/en/apps) by filling in all necessary information
3. Go to the App Details
4. Click Permissions
5. Ensure to give Read, write, and Direct Messages Access permission
6. Click Keys and Tokens
7. Note down API key and API Secret key (those are APPLICATION_CONSUMER_KEY and APPLICATION_CONSUMER_SECRET env variables that you will need to set in below section)
8. Generate Access Token and Access Token Secret
9. Note them down (those are ACCESS_TOKEN and ACCESS_TOKEN_SECRET env variables that you will need to set in below section)
10. Go to [environments](https://developer.twitter.com/en/account/environments)
11. In Account Activity API / Sandbox, click Set up dev environment, choose your own label but make sure App is assigned to the app you created earlier (the label will be ENVIRONMENT env variable that you will need to set in below section)
12. Find the user ID of your Twitter account (you can use this [site](https://codeofaninja.com/tools/find-twitter-id), enter your Twitter username and you get your ID) - the ID is TWITTER_USER_ID env variable you will need to set in below section

### Setup Near Account to be used by Flux SDK
1. Create folder `neardev/default`
2. Put your Near Account json file to folder `neardev/default`
3. You can find your Near Account json file by following this [guide](https://docs.near.org/docs/roles/developer/examples/near-api-js/guides#authenticating-with-near-shell)
The json file should contain information like below
```
{
  "account_id": "YOUR_DEVELOPER_ACCOUNT",
  "private_key": "ed25519:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
}
3. The account_id is NEAR_ACCOUNT_ID env variable that you will need to set in below section
```

### Setup Environment Variables
Open `config/default.js` to see what environment variables need to be setup, you can use export command in your terminal to set the environment variables

```
WEBHOOK_SERVER_URL --> this is URL of your deployed webhook (see Deploy section below how to get it)
WEBHOOK_ROUTE --> this is the route of your webhook (you can choose any route e.g. /webhook/twitter)
APPLICATION_CONSUMER_KEY --> this is your Twitter Application Consumer Key
APPLICATION_CONSUMER_SECRET --> this is your Twitter Application Consumer Secret
ACCESS_TOKEN --> this is your Twitter Application Access Token
ACCESS_TOKEN_SECRET --> this is your Twitter Application Access Token Secret
ENVIRONMENT --> this is your Twitter Application Environment
TWITTER_USER_ID --> this is Twitter User ID that you want to subscribe
NEAR_ACCOUNT_ID --> this is Near Account ID used to interact with Flux Protocol
```
### Install Dependencies
1. Run `npm i`

### Do Modification on flux-sdk
1. On this date (19 May 2020), I need to modify `node_modules/flux-sdk/src/FluxProvider.js` by changing `async connect` method to below code
```
async connect(contractId, keyStore, accountId) {
    this.near = await connect({...helpers.getConfig(contractId), deps: { keyStore: keyStore ? keyStore : new keyStores.BrowserLocalStorageKeyStore() } });
    if (typeof window !== 'undefined') {
        this.walletConnection = new WalletConnection(this.near, contractId);
        this.account = this.walletConnection.account();
        this.contract = new Contract(this.account, contractId, {
            viewMethods,
            changeMethods,
            sender: this.walletConnection.getAccountId(),
        });
    } else {
        this.account = await this.near.account(accountId);
        this.contract = new Contract(this.account, contractId, {
            viewMethods,
            changeMethods,
            sender: accountId,
        });
    }
    this.connected = true;
}
```
This is required because `flux-sdk` seems to work only from javascript in browser that supports `window` variable and doesn't have support yet for server-side Near Account that is normally used for server-side only application

## Deploy locally (using ngrok)
1. Download and install [ngrok](https://ngrok.com/download)
2. In separate terminal, run `ngrok http -bind-tls=true 3000`, this command will create ngrok tunnel to your machine port 3000 - Twitter will require the webhook to use https, hence why `-bind-tls` is required
3. Set environment variable WEBHOOK_SERVER_URL with value ngrok URL you obtained (e.g. https://16c1fc4a.ngrok.io)
4. Run the application by executing `npm start` - this will start webhook in localhost port 3000

P.S.: When you run `npm start` for the second time, third time, etc., your console may output error like "Error when creating subscription, Error when register", do not worry, this error happens because actually you only need to register your webhook and add your subscription to Twitter once but the current codebase keeps executing the registration and subscription request whenever the application is started

## Demo Video
See the demo [here](https://drive.google.com/file/d/1d5BuZ-YFvxjBZ_vczTKXZ2HVJo4tn_J4/view?usp=sharing)

You can run `npm run check-markets` and check that the market with ID mentioned in twitter bot reply is indeed there on the Blockchain

P.S.: Error handling has not been done properly, so when you test it, kindly ensure you always use same format of tweet, e.g. `@BotHackathon "<description inside double-quotes>" <end time in format like 31-12-2020 11:59pm>`

## TODO
1. Request pull / merge of my fix on `FluxProvider.js` to `flux-sdk` team
2. Proper error handling for flux timeout and invalid input in Twitter
3. Add linter to the codebase
4. Create scripts to add / remove Twitter webhook, add / remove user subscription independently and not put it in the `index.js`
5. Make the codebase more modular and add unit test
6. Deployment to public server (e.g. Heroku)
7. Handle MainNet - need to check if this requires `flux-sdk` change to support MainNet or not
8. Enhance the bot to do categorical market creation
9. Etc.
