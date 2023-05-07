import react, { useEffect, useState, useContext } from "react";
import AppRouter from './components/AppRouter'
import Navbar from './components/Navbar'
import {observer} from 'mobx-react-lite'
import {check} from './API/userAPI'
import {Context} from '../src/index'


export default observer(function App() {
  const {user} = useContext(Context)
  // const [loading, setLoading] = useState(true)

  useEffect(() => {
    check().then(data => {
      // user.setUser(true) //чё
      user.setIsAuth(true)
    })
    // .finally(() => {
    //   setLoading(false)
    // })
  }, [])

  return (
    <div>
      <Navbar />
      <AppRouter />
      {/* реализовать аппроутер просто здесь? */}
    </div>
  )

})