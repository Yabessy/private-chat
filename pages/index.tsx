import { useRecoilState } from "recoil"
import {Navbar,Chats} from "../components"
import { userState } from "../components/userAtom"

export default function Home() {
  const [user, setUser] = useRecoilState(userState)
  return (
    <main className="w-full h-screen bg-gray-100">
      <Navbar />
      {user ? (
        <Chats user={user}/>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-4xl font-bold">Welcome to Chat App</h1>
        </div>
      )}
    </main>
  )
}
