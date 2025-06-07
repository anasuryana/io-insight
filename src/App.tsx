
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Page from "./app/dashboard/Page"
import { Page as LoginPage } from "./app/login/Page"
import { Page as RolePage } from "./app/role/Page"
import { Page as HomePage } from "./app/home/Page"
import { useState } from "react";

function App() {
  const isAuthenticated = localStorage.getItem("isLoggedIn") === "true";
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navigate = useNavigate();

  function handleLoggedIn(theval: any) {
    setIsLoggedIn(theval)
    if (theval) {
      navigate('dashboard')
      // const config = {
      //   headers: {
      //     Authorization: 'Bearer ' + localStorage.getItem('token')
      //   }
      // }
      // axios.get(import.meta.env.VITE_APP_ENDPOINT + '/user', config)
      //   .then((response) => {
      //     const datanya = response.data
      //     setUserInfo({ ...datanya })
      //   }).catch(error => {
      //     console.log({ at: 'app.jsx', error })
      // if (error.status) {
      //   if (error.status === 401) {
      // localStorage.removeItem('isLoggedIn')
      // navigate('/')
      //     }
      //   }
      // })
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
          element={<Page onLoggedIn={handleLoggedIn} />} >
          <Route index element={<HomePage />} />
          <Route path="role" element={<RolePage />} />
        </Route>
        <Route>
          <Route path="*" element={<Page onLoggedIn={handleLoggedIn} />} />
        </Route>
      </Routes>
    </>
  )
}

export default App