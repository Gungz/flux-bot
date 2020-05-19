const Flux = require('flux-sdk');
const CONTRACT_ID = "fluxprotocol-phase-point-two";
const fluxInstance = new Flux();
const {
    keyStores
} = require('near-api-js');

(async () => {
    if (process.argv.length != 2) {
        console.error('usage node scripts/check-markets.js')
        return
    }
    await fluxInstance.connect(CONTRACT_ID, new keyStores.UnencryptedFileSystemKeyStore("neardev"), process.env.NEAR_ACCOUNT_ID);
    const markets = await fluxInstance.getAllMarkets();
    console.log(markets);
})();