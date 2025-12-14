import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 1.定义state
  const token = ref(localStorage.getItem('geeker-token') || '')
  //get and set
  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('geeker-token', newToken)
  }
  return { token, setToken }
})
