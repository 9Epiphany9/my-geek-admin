import auth from './modules/auth'

const directivesList: any = {
  // key 是指令名，value 是指令配置
  auth,
}

const directives = {
  install: function (app) {
    Object.keys(directivesList).forEach((key) => {
      // 注册指令，名称是 v-auth
      app.directive(key, directivesList[key])
    })
  },
}

export default directives
