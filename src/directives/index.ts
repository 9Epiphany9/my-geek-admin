import auth from './modules/auth'
import copy from './modules/copy' // ✨ 新增
import debounce from './modules/debounce' // ✨ 新增

const directivesList: any = {
  auth,
  copy, // ✨
  debounce, // ✨
}

const directives = {
  install: function (app) {
    Object.keys(directivesList).forEach((key) => {
      app.directive(key, directivesList[key])
    })
  },
}

export default directives
