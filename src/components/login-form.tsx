import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { AlertCircle } from "lucide-react"
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
  className,
  onLogin,
  password,
  userName,
  onUsernameChange,
  onPasswordChange,
  isSigning,
  messageFromServer,
  ...props
}: LoginFormProps) {

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your credential below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Username</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="fulan"
                  required
                  onChange={(e) => onUsernameChange(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" type="password" required onChange={(e) => onPasswordChange(e.target.value)} />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="button" className="w-full" disabled={isSigning} onClick={onLogin}>
                  Login
                </Button>
              </div>
              <div className="flex flex-col gap-3">
                {messageFromServer && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Unable to process your request</AlertTitle>
                    <AlertDescription>
                      <p>{messageFromServer}</p>

                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
