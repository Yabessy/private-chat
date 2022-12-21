import { addDoc, collection, doc, getDoc, getDocs, limit, onSnapshot, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../../firebase"
import ChatRoom from "./ChatRoom"

export default function Chats({ user }: any) {
  const [chatRooms, setChatRooms] = useState<any>([])
  const [chatRoom, setChatRoom] = useState<any>(null)
  const [search, setSearch] = useState("")
  const [finded, setFinded] = useState<any>([])
  useEffect(() => {
    onSnapshot(collection(db, "chatRooms"), (snapshot) => {
      setChatRooms(snapshot.docs)
    })
  }, [])
  useEffect(() => {
    onSnapshot(query(collection(db, "users2"), where("displayName", "==", search), limit(1)), (snapshot) => {
      setFinded(snapshot.docs.map((doc: any) => doc.data()))
    })
  }, [db, search])
  async function createChatRoom(ID: any) {
    let snap: any = []
    const q = query(collection(db, "chatRooms"), where("users", "array-contains", user.uid && ID), limit(1))
    const qSnap = await getDocs(q)
    qSnap.forEach((doc) => {
      snap.push(doc.id)
      snap.push(doc.data())
    })
    if (snap.length === 0) {
      console.log(snap)
      await addDoc(collection(db, "chatRooms"), {
        users: [user.uid, ID]
      })
    } else {
      setChatRoom(snap)
    }
  }
  return (
    <div>
      {chatRoom ? (
        <>
          <button onClick={() => setChatRoom(null)} className="btn">
            Back
          </button>
          <ChatRoom id={chatRoom[0]} users={chatRoom[1]} />
        </>
      ) : (
        <>
          <input className="border" type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
          {finded.map((user2: any) => (
            <div key={user2.uid} onClick={() => createChatRoom(user2.uid)}>
              <img src={user2.userImg} alt="" />
              <h1>{user2.displayName}</h1>
            </div>
          ))}
          {chatRooms &&
            chatRooms.map((chatRoom: any) => (
              <div key={chatRoom.id} onClick={() => createChatRoom(chatRoom.data().users[1])}>
                <h1>{chatRoom.data().users[0]}</h1>
              </div>
            ))}
        </>
      )}
    </div>
  )
}
