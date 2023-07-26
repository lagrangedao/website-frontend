import store from '../store'
import axios from 'axios'
import moment from 'moment'
import {
  ElMessage
} from 'element-plus'
import router from '../router';
let lastTime = 0

async function sendRequest(apilink, type, jsonObject, api_token) {
  // signOutFun()
  // axios.defaults.timeout = 60000
  axios.defaults.headers.common['Authorization'] = `Bearer ${api_token?api_token:store.state.accessToken}`
  try {
    let response
    switch (type) {
      case 'post':
        response = await axios.post(apilink, jsonObject)
        return response.data
      case 'put':
        response = await axios.put(apilink, jsonObject)
        return response.data
      case 'get':
        response = await axios.get(apilink)
        return response.data
      case 'delete':
        response = await axios.delete(apilink, {
          data: jsonObject
        })
        return response.data
    }
  } catch (err) {
    console.error(err, err.response)
    messageTip('error', err.response ? err.response.statusText || 'Request failed. Please try again later!' : 'Request failed. Please try again later!')
    if (err.response && err.response.status === 401) {
      signOutFun()
    } else if (err.response) {
      // The request has been sent, but the status code of the server response is not within the range of 2xx
      // console.log(err.response.data)
      // console.log(err.response.status)
      // console.log(err.response.headers)
      return err.response.data
    } else {
      // Something happened in setting up the request that triggered an Error
      // console.log('Error', err.message)
      return err
    }
  }
}

async function timeout(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay))
}

async function Init(callback) {
  if (typeof window.ethereum === 'undefined') {
    window.open('https://metamask.io/download.html')
    alert("Consider installing MetaMask!");
  } else {
    const ethereum = window.ethereum;
    ethereum
      .request({
        method: 'eth_requestAccounts'
      })
      .then((accounts) => {
        if (!accounts) {
          return false
        }
        web3Init.eth.getAccounts().then(async webAccounts => {
            store.dispatch('setMetaAddress', webAccounts[0])
            // const chainId = await ethereum.request({ method: 'eth_chainId' })
            // console.log(parseInt(chainId, 16))
            callback(webAccounts[0])
          })
          .catch(async (error) => {
            store.dispatch('setMetaAddress', accounts[0])
            callback(accounts[0])
          })
      })
      .catch((error) => {
        store.dispatch('setNavLogin', false)
        store.dispatch('setLogin', false)
        if (error === "User rejected provider access") {} else {
          alert("Please unlock MetaMask and switch to the correct network.");
          return false
        }
        console.error(
          `Error fetching accounts: ${error.message}.
        Code: ${error.code}. Data: ${error.data}`
        );
      });
  }
}

async function login() {
  if (!store.state.metaAddress || store.state.metaAddress === undefined) {
    const accounts = await ethereum.request({
      method: 'eth_requestAccounts'
    })
    store.dispatch('setMetaAddress', accounts[0])
  }

  const time = await throttle()
  if (!time) return false
  const signature = await sign()
  if (!signature) return false
  const token = await performSignin(signature)
  return !!token
}

async function throttle() {
  // Prevent multiple signatures
  let now = new Date().valueOf();
  if (lastTime > 0 && (now - lastTime) <= 2000) return false
  lastTime = now
  return true
}

async function sign(nonce) {
  store.dispatch('setLogin', false)
  const rightnow = (Date.now() / 1000).toFixed(0)
  const sortanow = rightnow - (rightnow % 600)
  const local = process.env.VUE_APP_DOMAINNAME
  const buff = Buffer.from("Signing in to " + local + " at " + sortanow, 'utf-8')
  let signature = null
  await ethereum.request({
    method: 'personal_sign',
    params: [buff.toString('hex'), store.state.metaAddress]
  }).then(sig => {
    signature = sig
  }).catch(err => {
    console.log(err)
    signature = ''
    signOutFun()
  })
  return signature
}

async function performSignin(sig) {
  try {
    const reqOpts = [store.state.metaAddress, sig]
    const response = await sendRequest(`${process.env.VUE_APP_BASEAPI}login`, 'post', reqOpts)
    if (response) {
      store.dispatch('setAccessToken', response.access_token)
      store.dispatch('setLogin', true)
      return true
    }
    messageTip('error', response.message || 'Fail')
    return null
  } catch (err) {
    console.log('login err:', err)
    messageTip('error', 'Fail')
    return null
  }
}

async function messageTip(type, text) {
  ElMessage({
    showClose: true,
    message: text,
    type: type,
  })
}

async function signOutFun() {
  store.dispatch('setAccessToken', '')
  store.dispatch('setLogin', false)
  store.dispatch('setNavLogin', false)
  store.dispatch('setMetaAddress', '')
  store.dispatch('setAccessSpace', '')
  store.dispatch('setAccessDataset', '')
  router.push({
    name: 'main'
  })
}

function momentFun(dateItem) {
  let dateNew = dateItem * 1000
  let dataUnit = ''
  let dataTime = new Date(dateNew) + ''
  let dataUnitIndex = dataTime.indexOf('GMT')
  let dataUnitArray = dataTime.substring(dataUnitIndex, dataUnitIndex + 8)
  switch (dataUnitArray) {
    case 'GMT+1000':
      dataUnit = 'UTC+10'
      break
    case 'GMT-1000':
      dataUnit = 'UTC-10'
      break
    case 'GMT+0000':
      dataUnit = 'UTC+0'
      break
    default:
      dataUnit = dataUnitArray ? dataUnitArray.replace(/0/g, '').replace('GMT', 'UTC') : '-'
      break
  }
  dateNew = dateNew ?
    moment(new Date(parseInt(dateNew))).format('YYYY-MM-DD HH:mm:ss') + ` (${dataUnit})` :
    '-'
  return dateNew
}

function popupwindow(title, url) {
  return window.open(
    "https://twitter.com/intent/tweet?text=" +
    encodeURIComponent(title),
    "_blank",
    "toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes, width=700, height=600,top=100,left=350"
  );
}

async function getUnit(id) {
  let unit = 'ETH'
  let name = ''
  let url = ''
  let url_tx = ''
  switch (id) {
    case 56:
      unit = 'BNB'
      name = 'Binance Smart Chain Mainnet '
      url = `${process.env.VUE_APP_BSCBLOCKURL}/address/`
      url_tx = `${process.env.VUE_APP_BSCBLOCKURL}/tx/`
      break
    case 97:
      unit = 'tBNB'
      name = 'Binance Smart Chain Testnet '
      url = `${process.env.VUE_APP_BSCTESTNETBLOCKURL}/address/`
      url_tx = `${process.env.VUE_APP_BSCTESTNETBLOCKURL}/tx/`
      break
    case 137:
      unit = 'MATIC'
      name = 'Polygon Mainnet '
      url = `${process.env.VUE_APP_POLYGONBLOCKURL}/address/`
      url_tx = `${process.env.VUE_APP_POLYGONBLOCKURL}/tx/`
      break
    case 80001:
      unit = 'MATIC'
      name = 'Mumbai Testnet '
      url = `${process.env.VUE_APP_MUMBAIBLOCKURL}/address/`
      url_tx = `${process.env.VUE_APP_MUMBAIBLOCKURL}/tx/`
      break
    case 3141:
      unit = 'ETH'
      name = 'Filecoin - Hyperspace testnet '
      break
    case 11155111:
      unit = 'ETH'
      name = 'Sepolia Testnet '
      url = `${process.env.VUE_APP_SEPOLIABLOCKURL}/address/`
      url_tx = `${process.env.VUE_APP_SEPOLIABLOCKURL}/tx/`
      break
  }
  return ({
    unit,
    name,
    url,
    url_tx
  })
}

async function changeIDLogin(type) {
  const chainId = await ethereum.request({
    method: 'eth_chainId'
  })
  const list = [137, 80001, 97]
  const getPast = await list.some(t => t === parseInt(chainId, 16))
  if (type) {} else if (!getPast) messageTip('error', 'Switch to Polygon Mainnet, Mumbai Testnet or Binance Smart Chain Testnet!')
  return getPast
}

function copyContent(text, tipCont) {
  var txtArea = document.createElement('textarea')
  txtArea.id = 'txt'
  txtArea.style.position = 'fixed'
  txtArea.style.top = '0'
  txtArea.style.left = '0'
  txtArea.style.opacity = '0'
  txtArea.value = text
  document.body.appendChild(txtArea)
  txtArea.select()

  try {
    var successful = document.execCommand('copy')
    var msg = successful ? 'successful' : 'unsuccessful'
    console.log('Copying text command was ' + msg)
    if (successful) {
      messageTip('success', tipCont)
      return true
    }
  } catch (err) {
    console.log('Oops, unable to copy')
  } finally {
    document.body.removeChild(txtArea)
  }
  return false
}

function hiddAddress(val) {
  if (val) return `${val.substring(0, 5)}...${val.substring(val.length - 5)}`
  else return '-'
}

const cmOptions = {
  mode: 'text/x-markdown', // Language mode
  // theme: 'dracula', // Theme
  lineNumbers: true, // Show line number
  smartIndent: true, // Smart indent
  indentUnit: 4, // The smart indent unit is 2 spaces in length
  foldGutter: true, // Code folding
  matchBrackets: true,
  autoCloseBrackets: true,
  styleActiveLine: true, // Display the style of the selected row
  readOnly: false,
}

const Web3 = require('web3');
let web3Init
if (typeof window.ethereum === 'undefined') {
  window.open('https://metamask.io/download.html')
  alert("Consider installing MetaMask!");
} else {
  if (window.ethereum) {
    web3 = new Web3(ethereum);
    web3.setProvider(ethereum);
  } else if (window.web3) {
    web3 = window.web3;
    console.log("Injected web3 detected.");
  } else {
    var currentProvider = web3.currentProvider;
    web3 = new Web3(currentProvider);
    web3.setProvider(currentProvider);
    console.log("No web3 instance injected, using Local web3.");
  }
  web3Init = web3
}

export default {
  sendRequest,
  timeout,
  Init,
  web3Init,
  login,
  messageTip,
  signOutFun,
  momentFun,
  popupwindow,
  copyContent,
  getUnit,
  changeIDLogin,
  hiddAddress,
  cmOptions
}