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
    onSnapshot(query(collection(db, "chatRooms"), where("users", "array-contains", user.uid)), (snapshot) => {
      setChatRooms(snapshot.docs)
    })
  }, [db])
  useEffect(() => {
    onSnapshot(query(collection(db, "users2"), where("displayName", "==", search), limit(1)), (snapshot) => {
      setFinded(snapshot.docs.map((doc: any) => doc.data()))
    })
    console.log(finded)
  }, [db, search])
  async function createChatRoom(ID: any, photoURL: any, displayName: any) {
    setChatRoom(null)
    const q = query(collection(db, "chatRooms"), where("users", "in", [[user.uid, ID]]), limit(1))
    const qSnap = await getDocs(q).then((snapshot) => snapshot.docs)
    if (qSnap.length === 0) {
      await addDoc(collection(db, "chatRooms"), {
        users: [user.uid, ID],
        theirImg: photoURL,
        theirName: displayName
      }).then(async () => {
        const qSnap = await getDocs(q).then((snapshot) => snapshot.docs)
        setChatRoom(qSnap)
      })
    } else {
      setChatRoom(qSnap)
    }
  }
  return (
    <div>
      {chatRoom ? (
        <>
          <button onClick={() => setChatRoom(null)} className="btn">
            Back
          </button>
          <ChatRoom chat={chatRoom[0]} />
        </>
      ) : (
        <>
          <input className="border" type="text" value={search} onChange={(e) => setSearch(e.target.value)} />
          {finded.map((user2: any) => (
            <div className="flex" key={user2.uid} onClick={() => createChatRoom(user2.uid, user2.photoURL, user2.displayName)}>
              <img src={user2.photoURL} alt="" className="h-7 rounded-full" />
              <h1>{user2.displayName}</h1>
            </div>
          ))}
          {chatRooms &&
            chatRooms.map((chatRoom: any) => (
              <div
                className="flex"
                key={chatRoom.id}
                onClick={() => {
                  createChatRoom(chatRoom.data().users[1], chatRoom.data().theirImg, chatRoom.data().theirName)
                }}>
                <img src={chatRoom.data().theirImg} className="h-7 rounded-full" alt="" />
                <h1>{chatRoom.data().theirName}</h1>
              </div>
            ))}
        </>
      )}
    </div>
  )
}
