import { LoginForm } from "@/components/login-form"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function Page({ onLoggedIn }: { onLoggedIn: any }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (localStorage.getItem('isLoggedIn')) {
      navigate('dashboard')
      onLoggedIn(true)
    } else {
      onLoggedIn(false)
    }
  }, [])

  function handleClick() {
    if (username === "admin" && password === "1234") {
      localStorage.setItem("isLoggedIn", "true");
      onLoggedIn(true)
      navigate('dashboard')
    } else {
      alert("Login gagal!");
    }
  }
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm
          onLogin={handleClick}
          userName={username}
          password={password}
          onUsernameChange={setUsername}
          onPasswordChange={setPassword}
        />
      </div>
    </div>
  )
}
