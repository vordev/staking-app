import axios from 'axios';

const API_URL = 'https://ropsten.etherscan.io/api';
const API_KEY = '6G3BSAWR61TF18GC8GQ1K8C6BYM25GMRV3';

const getCurrentBlock = async () => {
  const response = await axios({
    method: 'GET',
    url: `${API_URL}?module=proxy&action=eth_blockNumber&apikey=${API_KEY}`
  });
  return response.data.result;
}

const getTransactionsCount = async (address: string) => {
  const response = await axios({
    method: 'GET',
    url: `${API_URL}?module=account&action=txlist&address=${address}&sort=asc&apikey=${API_KEY}`
  });
  return response.data.result.length;
};

const getTransactionsList = async (address: string) => {
  const response = await axios({
    method: 'GET',
    url: `${API_URL}?module=account&action=txlist&address=${address}&sort=desc&apikey=${API_KEY}&page=${1}&offset=${50}`
  });
  return response.data.result;
}

const getTotalSupply = async (address: string, blockNo: number) => {
  const response = await axios({
    method: 'GET',
    url: `${API_URL}?module=stats&action=tokensupply&contractaddress=${address}&sort=asc&apikey=${API_KEY}&blockno=${blockNo}`
  });
  return response.data.result;
}

export default {
  getTransactionsCount,
  getTransactionsList,
  getTotalSupply,
  getCurrentBlock,
};
