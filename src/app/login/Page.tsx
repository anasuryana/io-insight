import { LoginForm } from "@/components/login-form"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"

export function Page({ onLoggedIn }: { onLoggedIn: any }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSigning, setIsSigning] = useState(false)
  const [messageFromServer, setMessageFromServer] = useState('')

  useEffect(() => {
    if (localStorage.getItem('isLoggedIn')) {
      navigate('dashboard')
      onLoggedIn(true)
    } else {
      onLoggedIn(false)
    }
  }, [])

  function handleClick() {
    setIsSigning(true)
    const dataInput = JSON.stringify({
      username: username, password: password
    })
    setMessageFromServer('')
    axios
      .post(import.meta.env.VITE_APP_ENDPOINT + '/users/login', dataInput, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        const token = response.data.token
        localStorage.setItem('isLoggedIn', token)
        onLoggedIn(true)
        setIsSigning(false)
        setMessageFromServer('')
        navigate('dashboard')
      }).catch(error => {
        try {
          setMessageFromServer(error.response.data.errors.message)
        } catch (e) {
          setMessageFromServer(error.message)
        }
        setIsSigning(false)
      })
  }
  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-3xl">
        <LoginForm
          onLogin={handleClick}
          userName={username}
          password={password}
          onUsernameChange={setUsername}
          onPasswordChange={setPassword}
          isSigning={isSigning}
          messageFromServer={messageFromServer}
        />
      </div>
    </div>
  )
}
