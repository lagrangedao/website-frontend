const Web3 = require('web3');
const web3 = new Web3('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');

// 当前写死的 gasprice
const gasPrice = web3.utils.toWei('2.5', 'gwei'); // 2.5 Gwei

// 动态获取当前的 gasprice
web3.eth.getGasPrice().then((currentGasPrice) => {
  const transactionParameters = {
    to: '0xRecipientAddress',
    value: web3.utils.toHex(web3.utils.toWei('0.1', 'ether')),
    gas: 21000,
    gasPrice: currentGasPrice // 使用动态获取的 gasprice
  };

  web3.eth.sendTransaction(transactionParameters)
    .on('transactionHash', (hash) => {
      console.log('Transaction sent, hash:', hash);
    })
    .on('receipt', (receipt) => {
      console.log('Transaction confirmed, receipt:', receipt);
    })
    .on('error', (error) => {
      console.error('Transaction error:', error);
    });
});