
import { Routes, Route, useNavigate } from "react-router-dom";
import Page from "./app/dashboard/Page"
import { Page as LoginPage } from "./app/login/Page"
import { Page as HomePage } from "./app/home/Page"
import { useState } from "react";
import axios from "axios"
import DevicePage from "./app/master/DevicePage";
import SMSPage from "./app/master/SMSPage";
import RolePage from "./app/access/RolePage";
import UserPage from "./app/access/UserPage";
import Report1Page from "./app/report/Report1Page";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({})
  console.log(isLoggedIn)

  function handleLoggedIn(theval: any) {
    setIsLoggedIn(theval)

    if (theval) {
      navigate('dashboard')
      const config = {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('isLoggedIn')
        }
      }
      axios.get(import.meta.env.VITE_APP_ENDPOINT + '/user', config)
        .then((response) => {
          const datanya = response.data.data
          setUserInfo({ ...datanya })
        }).catch(error => {
          setUserInfo({})
          console.log({ at: 'app.jsx', error })
          if (error.status) {
            if (error.status === 401) {
              localStorage.removeItem('isLoggedIn')
              navigate('/')
            }
          }
        })
    }
  }
  return (
    <>
      <Routes>
        <Route
          index
          element={<LoginPage onLoggedIn={handleLoggedIn} />} />
        <Route
          path="dashboard"
          element={<Page onLoggedIn={handleLoggedIn} userInfo={userInfo} />} >
          <Route index element={<HomePage />} />
          <Route path="access-role" element={<RolePage userInfo={userInfo} />} />
          <Route path="access-user" element={<UserPage userInfo={userInfo} />} />
          <Route path="master-device" element={<DevicePage userInfo={userInfo} />} />
          <Route path="master-sms" element={<SMSPage userInfo={userInfo} />} />
          <Route path="report-1" element={<Report1Page />} />
        </Route>
        <Route>
          <Route path="*" element={<Page onLoggedIn={handleLoggedIn} userInfo={userInfo} />} />
        </Route>
      </Routes>
    </>
  )
}

export default App