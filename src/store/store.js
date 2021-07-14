import { createStore } from 'vuex';
import coins from './modules/coins';

const modules = {
  coins,
};

const store = createStore({
  modules,
});

export default store;
