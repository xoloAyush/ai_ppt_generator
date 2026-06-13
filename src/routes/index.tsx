
import { authClient } from '#/lib/auth-client'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { getSession } from '../lib/auth-function'

export const Route = createFileRoute('/')({
  
  beforeLoad: async (location) => {
    const session = await getSession()

    if(!session) {
      throw redirect({
        to: '/login',
        search:{redirect: location.href}
      })
  }
  return {user: session.user}
  },
  component: App
 })

function App() {

  const {data} = authClient.useSession()

  // console.log(data)

  return (
    <main className='min-h-screen pt-24 pb-12 px-4'>
      <div className='max-w-4xl mx-auto'>
    <h1>Hello friends</h1>
    </div>
    </main>
  )
}
