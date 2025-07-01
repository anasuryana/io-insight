import { Button } from "@/components/ui/button"
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { AlertCircle, Command } from "lucide-react"
type LoginFormProps = React.ComponentProps<"div"> & {
  userName: string;
  password: string;
  messageFromServer: string;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onLogin?: () => void;
  isSigning: boolean;
};

export function LoginForm({
  onLogin,
  onUsernameChange,
  onPasswordChange,
  isSigning,
  messageFromServer
}: LoginFormProps) {

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-md border border-gray-200 grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        <div className="bg-gradient-to-br from-blue-700 to-blue-400 relative flex flex-col justify-center items-center p-16 text-center border-r border-gray-100">
          <div className="absolute top-6 left-6 flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
              <Command className="w-6 h-6 text-blue-700" />
            </div>
            <span className="text-white font-bold text-xl">IO Insight</span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
            <p className="text-sm text-white mt-1">Log in to access your system</p>
          </div>
        </div>
        <div className="p-10">
          <CardHeader className="text-left space-y-1 mb-6 p-0">
            <CardTitle className="text-2xl font-bold tracking-tight text-gray-800">Login</CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>

          <form>
            <div className="grid gap-6">
              {/* Username */}
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Username"
                  required
                  onChange={(e) => onUsernameChange(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  onChange={(e) => onPasswordChange(e.target.value)}
                />
              </div>
              {messageFromServer && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{messageFromServer}</AlertDescription>
                </Alert>
              )}
              <Button
                type="button"
                variant="outline"
                className="w-full border-blue-600 text-blue-600 hover:bg-blue-200"
                disabled={isSigning}
                onClick={onLogin}
              >
                {isSigning ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
