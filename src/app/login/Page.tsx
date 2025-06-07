import { LoginForm } from "@/components/login-form"
import { useState } from "react";

export function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleClick() {
    alert(`${username} dan ${password}`)
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
