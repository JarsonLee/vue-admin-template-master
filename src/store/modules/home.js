import mockRequest from "@/utils/mockRequest";
const actions = {
  async getData({ commit }) {
    let result = await mockRequest.get("/home/list");
    if (result.code == 20000) {
      commit("GETDATA", result.data);
    }
  },
};
const mutations = {
  GETDATA(state, list) {
    state.list = list;
  },
};
const state = {
  list: {},
};
const getters = {};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
