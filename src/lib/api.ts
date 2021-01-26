import axios from 'axios';

const API_URL = 'https://dotrace.herokuapp.com/api';

const getHistory = async () => {
  const response = await axios({
    url: `${API_URL}/rebase`,
    method: 'GET',
  });
  return response.data;
};

const pushHistory = async (percent: number) => {
  await axios({
    url: `${API_URL}/rebase`,
    method: 'POST',
    data: {
      percent
    }
  });
}

export default {
  getHistory,
  pushHistory,
};
