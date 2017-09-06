import { observable, action, useStrict } from 'mobx'

useStrict(true);

class UserStore {
  @observable admin = { loginStatus: false }
  @observable nav = { activeItem: 'Leaderboard' }

  @action login = () => {
    return new Promise((resolve, reject) => {
      this.admin.loginStatus = true
      resolve(this.admin.loginStatus)
    })
  }

  @action logout = () => {
    return new Promise((resolve, reject) => {
      this.admin.loginStatus = false
      resolve(this.admin.loginStatus)
    })
  }

  @action setACtiveNavItem = (itemName) => this.nav.activeItem = itemName
}

const store = new UserStore()
export default store
export { UserStore }