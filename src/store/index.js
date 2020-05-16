import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from "vuex-persist"

Vue.use(Vuex)

const vuexPersist = new VuexPersist({
  key: "vuex",
  storage: window.localStorage
});

export default new Vuex.Store({
  state: {
    seed: "",
    account: ""
  },
  mutations: {
    updateSeed(state, n) {
      state.seed = n;
    },
    updateAccount(state, n) {
      state.account = n;
    },
  },
  actions: {
  },
  modules: {
  },
  plugins: [vuexPersist.plugin]
})
