import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store =  new Vuex.Store({
  state: {
    ifLogin: false, //是否已登陆
    name: '',//用户姓名  
    username: '',//用户编号  
    role: '',//用户角色  
    roleId: '',//角色ID  [1:系统管理员 2:院系领导 3:辅导员 4:任课教师 5:学生]
    //如果是学生的话还有以下参数
    grade: '',//年级   
    major: '',//专业 
    l_class: '',//班级 
    stuItemNum: 0, //学生奖项数
    teaItemNum: 0, //教师奖项数
    totalItemNum: 0, //总奖项数
  },
  mutations: {
    //用户信息初始化设置
    initUserInfo: (state, info) => {
      state.stuItemNum = info.stuItemNum
      state.teaItemNum = info.teaItemNum
      state.totalItemNum = info.totalItemNum
      state.roleId = info.roleId
      //closeDebug console.log('当前角色设为：'+info.roleId)
      state.name = info.name
      state.username = info.username
      state.role = info.role
      if(info.roleId === 5){
        state.grade = info.grade
        state.major = info.major
        state.l_class = info.l_class
      }
    },
    //设置登陆状态「未启用」
    setLoginState: (state, LoginState) => {
      //closeDebug console.log('当前登陆状态设为：',LoginState)
      state.ifLogin = LoginState
    },
  },
  getters: {
    ifLogin: state => state.ifLogin,//是否已登陆
    name: state => state.name,
    username: state => state.username,//用户编号  
    role: state => state.role,//用户角色  
    roleId: state => state.roleId,//角色ID  [1:系统管理员 2:院系领导 3:辅导员 4:任课教师 5:学生]
    //如果是学生的话还有以下参数
    grade: state => state.grade,//年级   
    major: state => state.major,//专业 
    l_class: state => state.l_class,//班级 
    stuItemNum: state => state.stuItemNum, //学生奖项数
    teaItemNum: state => state.teaItemNum, //教师奖项数
    totalItemNum: state => state.totalItemNum, //总奖项数
  },
  actions: {
    
  },
  modules: {
  }
})

export default store
