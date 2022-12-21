import { collection, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../../firebase"

export default function Message({ chatRoom }: any) {
  const [messages, setMessages] = useState<any>([])
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "chatRooms", chatRoom, "messages"), (snapshot) => {
      setMessages(snapshot.docs)
    })
    return unsub
  }, [db])
  return (
    <div>
      {messages &&
        messages.map((message: any) => (
          <div key={message.id}>
            <h1>{message.data().message}</h1>
          </div>
        ))}
    </div>
  )
}
