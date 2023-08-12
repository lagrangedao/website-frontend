import {
  createStore
} from 'vuex'

export default createStore({
  state: {
    metaAddress: sessionStorage.getItem('metaAddressLag') || '',
    navLogin: sessionStorage.getItem('navLogin') || false,
    lagLogin: sessionStorage.getItem('loginLag') || false,
    accessToken: sessionStorage.getItem('access_token_lag') || '',
    accessAvatar: sessionStorage.getItem('access_avatar') || require("@/assets/images/dashboard/people_default.png"),
    // accessAvatar: require("@/assets/images/dashboard/people_default.png"),
    accessName: sessionStorage.getItem('access_name') || '-',
    accessSpace: sessionStorage.getItem('access_space') || '',
    accessDataset: sessionStorage.getItem('access_dataset') || '',
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
    SET_ACCESSAVATAR: (state, accessAvatar) => {
      state.accessAvatar = accessAvatar
      sessionStorage.setItem('access_avatar', accessAvatar)
    },
    SET_ACCESSNAME: (state, accessName) => {
      state.accessName = accessName
      sessionStorage.setItem('access_name', accessName)
    },
    SET_ACCESSSPACE: (state, accessSpace) => {
      state.accessSpace = accessSpace
      sessionStorage.setItem('access_space', accessSpace)
    },
    SET_ACCESSDATASET: (state, accessDataset) => {
      state.accessDataset = accessDataset
      sessionStorage.setItem('access_dataset', accessDataset)
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
    }
  },
  getters: {
    // state的计算属性(通过store.getters.loginButton访问)    
    loginButton: state => state.metaAddress.split(' ')[1]
  },
  modules: {}
})