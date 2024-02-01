import {
  createStore
} from 'vuex'

export default createStore({
  state: {
    metaAddress: localStorage.getItem('metaAddressLag') || '',
    navLogin: localStorage.getItem('navLogin') || false,
    lagLogin: localStorage.getItem('loginLag') || false,
    accessToken: localStorage.getItem('access_token_lag') || '',
    accessAvatar: localStorage.getItem('access_avatar') || require("@/assets/images/dashboard/people_default.png"),
    // accessAvatar: require("@/assets/images/dashboard/people_default.png"),
    accessName: localStorage.getItem('access_name') || '-',
    accessSpace: localStorage.getItem('access_space') || '',
    accessDataset: localStorage.getItem('access_dataset') || '',
    gateway: localStorage.getItem('lag_gateway') || '',
    getRouter: sessionStorage.getItem('lag_get_router') || ''
  },
  mutations: {
    SET_METAADDRESS: (state, metaAddress) => {
      state.metaAddress = metaAddress
      localStorage.setItem('metaAddressLag', metaAddress)
    },
    SET_NAVLOGIN: (state, navLogin) => {
      state.navLogin = navLogin
      localStorage.setItem('navLogin', navLogin)
    },
    SET_LAGLOGIN: (state, lagLogin) => {
      state.lagLogin = lagLogin
      localStorage.setItem('loginLag', lagLogin)
    },
    SET_ACCESSTOKEN: (state, accessToken) => {
      state.accessToken = accessToken
      localStorage.setItem('access_token_lag', accessToken)
    },
    SET_ACCESSAVATAR: (state, accessAvatar) => {
      state.accessAvatar = accessAvatar
      localStorage.setItem('access_avatar', accessAvatar)
    },
    SET_ACCESSNAME: (state, accessName) => {
      state.accessName = accessName
      localStorage.setItem('access_name', accessName)
    },
    SET_ACCESSSPACE: (state, accessSpace) => {
      state.accessSpace = accessSpace
      localStorage.setItem('access_space', accessSpace)
    },
    SET_ACCESSDATASET: (state, accessDataset) => {
      state.accessDataset = accessDataset
      localStorage.setItem('access_dataset', accessDataset)
    },
    SET_GATEWAY: (state, gateway) => {
      state.gateway = gateway
      localStorage.setItem('lag_gateway', gateway)
    },
    SET_GETROUTER: (state, getRouter) => {
      state.getRouter = getRouter
      sessionStorage.setItem('lag_get_router', getRouter)
    }
  },
  actions: {
    setMetaAddress({
      commit
    }, metaAddress) {
      commit('SET_METAADDRESS', metaAddress)
    },
    setNavLogin({
      commit
    }, navLogin) {
      commit('SET_NAVLOGIN', navLogin)
    },
    setLogin({
      commit
    }, lagLogin) {
      commit('SET_LAGLOGIN', lagLogin)
    },
    setAccessToken({
      commit
    }, accessToken) {
      commit('SET_ACCESSTOKEN', accessToken)
    },
    setAccessAvatar({
      commit
    }, accessAvatar) {
      commit('SET_ACCESSAVATAR', accessAvatar)
      // commit('SET_ACCESSAVATAR', require("@/assets/images/dashboard/people_default.png"))
    },
    setAccessName({
      commit
    }, accessName) {
      commit('SET_ACCESSNAME', accessName)
    },
    setAccessSpace({
      commit
    }, accessSpace) {
      commit('SET_ACCESSSPACE', accessSpace)
    },
    setAccessDataset({
      commit
    }, accessDataset) {
      commit('SET_ACCESSDATASET', accessDataset)
    },
    setGateway({
      commit
    }, gateway) {
      commit('SET_GATEWAY', gateway)
    },
    setGetRouter({
      commit
    }, getRouter) {
      commit('SET_GETROUTER', getRouter)
    }
  },
  getters: {
    // state的计算属性(通过store.getters.loginButton访问)    
    loginButton: state => state.metaAddress.split(' ')[1]
  },
  modules: {}
})