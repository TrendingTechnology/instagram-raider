import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

const path = require('path')
const app = require('electron').remote.app

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    savefolder: path.join(app.getPath('downloads'), 'Instagram'),
    timeout: 30
  },
  mutations: {
    updateSaveFolder (state, payload) {
      state.savefolder = payload
    },
    updateTimeout (state, payload) {
      state.timeout = payload
    }
  },
  actions: {
    updateSaveFolder (state, payload) {
      state.commit('updateSaveFolder', payload)
    },
    updateTimeout (state, payload) {
      state.commit('updateTimeout', payload)
    }
  },
  getters: {
    getSaveFolder: state => {
      return state.savefolder
    },
    getTimeout: state => {
      return state.timeout
    }
  }
})
