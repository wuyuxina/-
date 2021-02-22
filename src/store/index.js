import { createStore } from "vuex";

export default createStore({
  state: {
    chooseIndex: null, // 头部菜单的选中
    btnList: [], // 按钮列表
  },
  mutations: {
    /**
     * 改变头部菜单的选中状态
     * @param state
     * @param params
     */
    changeIndex(state, params) {
      state.chooseIndex = params
    },
    /**
     * 添加每个页面的按钮列表
     * @param state
     * @param params
     */
    changeBtnList(state, params) {
      state.btnList = params
    }
  },
  actions: {
  },
  modules: {
  }
});
