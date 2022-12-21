import { addDoc, collection } from "firebase/firestore"
import { useState } from "react"
import { useRecoilState } from "recoil"
import { db } from "../../firebase"
import { userState } from "../userAtom"

export default function Input({ chatRoom }: any) {
  const [user, setUser] = useRecoilState(userState)
  const [message, setMessage] = useState("")
  const sendMessage = (message: string) => {
    addDoc(collection(db, "chatRooms", chatRoom, "messages"), {
      message,
      user,
      timestamp: new Date().getTime()
    })
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        sendMessage(message)
      }}>
      <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
      <button type="submit" className="btn">
        Send
      </button>
    </form>
  )
}
