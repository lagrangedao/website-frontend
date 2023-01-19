import { createStore } from 'vuex'

export default createStore({
  state: {
    metaAddress: sessionStorage.getItem('metaAddressLag') || '',
    navLogin: sessionStorage.getItem('navLogin') || false,
    lagLogin: sessionStorage.getItem('loginLag') || false,
    accessToken: sessionStorage.getItem('access_token_lag') || ''
  },
  mutations: {
    SET_METAADDRESS: (state, metaAddress) => {
      state.metaAddress = metaAddress
      sessionStorage.setItem('metaAddressLag', metaAddress)
    },
    SET_NAVLOGIN: (state, navLogin) => {
      state.navLogin = navLogin
      sessionStorage.setItem('navLogin', navLogin)
    },
    SET_LAGLOGIN: (state, lagLogin) => {
      state.lagLogin = lagLogin
      sessionStorage.setItem('loginLag', lagLogin)
    },
    SET_ACCESSTOKEN: (state, accessToken) => {
      state.accessToken = accessToken
      sessionStorage.setItem('access_token_lag', accessToken)
    },
  },
  actions: {
    setMetaAddress ({commit}, metaAddress) {
      commit('SET_METAADDRESS', metaAddress)
    },
    setNavLogin ({commit}, navLogin) {
      commit('SET_NAVLOGIN', navLogin)
    },
    setLogin ({commit}, lagLogin) {
      commit('SET_LAGLOGIN', lagLogin)
    },
    setAccessToken ({commit}, accessToken) {
      commit('SET_ACCESSTOKEN', accessToken)
    },
  },
  getters: {               
    // state的计算属性(通过store.getters.loginButton访问)    
    loginButton: state => state.metaAddress.split(' ')[1]
  },
  modules: {
  }
})
