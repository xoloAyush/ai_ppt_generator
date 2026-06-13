import { Switch } from '#/components/ui/switch'
import { authClient } from '#/lib/auth-client'
import { createFileRoute } from '@tanstack/react-router'
import { ModeToggle } from '../components/mode-toggle'

export const Route = createFileRoute('/')({ component: App })

function App() {

  const {data} = authClient.useSession()

  console.log(data)

  return (
    <div>
    <ModeToggle />
    </div>
  )
}
