import axios from 'axios';

const moduleState = {
  coins: []
};

const moduleActions = {
  getCoins({ commit }) {
    const apiUrl = process.env.VUE_APP_API_URL;

    axios.get(`${apiUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false`)
    .then(response => {
      commit('SET_COINS', response.data)
    })
    
  },
};

const moduleMutations = {
  SET_COINS(state, coins) {
    // Vue.set(state, 'coins', coins);
    state.coins = coins
  },
};

export default {
  state: moduleState,
  actions: moduleActions,
  mutations: moduleMutations,
};
