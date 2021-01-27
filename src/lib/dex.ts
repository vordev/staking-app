import axios from 'axios';
import Config from 'config';
import web3client from './web3client';
import coingecko from './coingecko';

const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaGVjayI6dHJ1ZSwiaXNzIjoiZGV4dG9vbHMuaW8iLCJzdWIiOiJhbnlvbmUiLCJyZWYiOiI1MC43LjE1OS4zNCIsImlhdCI6MTU5OTQ5MjEzMH0.VKcBB6v3pspBu4QMzQIk5nV5MGZHoAKDG4Hhkv5dC1E';
const API_URL = 'https://www.dextools.io/api';
const PROXY = 'https://cors-anywhere.herokuapp.com/'


const getEthPrice = async () => {
  const response = await axios({
    method: 'GET',
    url: `${PROXY}${API_URL}/common/ethPrice`,
    headers: {
      authorization: `Bearer ${API_KEY}`
    }
  });
  if (response.data.message !== 'OK') return 0;
  return response.data.result.ethusd;
}

const getTokenPrice = async () => {
  const supply = await web3client.getBalance(web3client.tokenContract, Config.WethLpToken.address);
  const wethBalance = await web3client.getBalance(web3client.wethTokenContract, Config.WethLpToken.address);
  const ethPrice = await coingecko.getEthPrice();
  return ethPrice * wethBalance / supply;
};

const getWethLpTokenPrice = async () => {
  const totalSupply = await web3client.getTotalSupply(web3client.wethLpTokenContract);
  const wethBalance = await web3client.getBalance(web3client.wethTokenContract, Config.WethLpToken.address);
  const ethPrice = await coingecko.getEthPrice();
  return 2 * ethPrice * wethBalance / totalSupply;
}

const getTokenPerLpToken = async () => {
  const totalSupply = await web3client.getTotalSupply(web3client.wethLpTokenContract);
  const tokenBalance = await web3client.getBalance(web3client.tokenContract, Config.WethLpToken.address);
  return tokenBalance / totalSupply;
}

const getWethPerLpToken = async () => {
  const totalSupply = await web3client.getTotalSupply(web3client.wethLpTokenContract);
  const wethBalance = await web3client.getBalance(web3client.wethTokenContract, Config.WethLpToken.address);
  return wethBalance / totalSupply;
}

const getNerdzLpTokenPrice = async () => {
  const totalSupply = await web3client.getTotalSupply(web3client.nerdzLpTokenContract);
  const wethBalance = await web3client.getBalance(web3client.wethTokenContract, Config.NerdzLpToken.address);
  const ethPrice = await coingecko.getEthPrice();
  return 2 * ethPrice * wethBalance / totalSupply;
}

export default {
  getTokenPrice,
  getEthPrice,
  getWethLpTokenPrice,
  getNerdzLpTokenPrice,
  getTokenPerLpToken,
  getWethPerLpToken,
};
