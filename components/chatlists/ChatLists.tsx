import { addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore"
import { useState } from "react"
import { useRecoilState } from "recoil"
import { auth, db } from "../../firebase"
import { userState } from "../../atom/userAtom"
import ChatList from "./ChatList"
import { useRouter } from "next/router"

export default function Chatlists({ isUserHadChat }: any) {
  const router = useRouter()
  const [randomUser, setRandomUser] = useState(null)
  const [currentUser] = useRecoilState(userState)
  async function searchRandomFriend() {
    console.log("searching...")
    const usersRef = collection(db, "users")
    // @ts-ignore
    const q = query(usersRef, where("uid", "!=", currentUser?.uid))
    const querySnapshot = await getDocs(q)
    try {
      const randomNum = Math.floor(Math.random() * querySnapshot.docs.length)
      // @ts-ignore
      setRandomUser(querySnapshot.docs[randomNum].data())
    } catch (e) {
      console.log(e)
    }
  }
  async function openChatRoom() {
    const docRef = doc(db, "users", currentUser.uid, "chats", randomUser.uid)
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
      await setDoc(docRef, {
        uid: randomUser.uid,
        name: randomUser.name,
        photoURL: randomUser.photoURL
      })
      await addDoc(collection(db, "users", currentUser.uid, "chats", randomUser.uid, "messages"), {
        uid: currentUser.uid,
        message: "Hello",
        timestamp: serverTimestamp()
      })
        .then(() => router.push(`/chatroom?yourID=${currentUser.uid}&theirID=${randomUser.uid}`))
        .catch((e) => console.log(e))
    } else {
      router.push(`/chatroom?yourID=${currentUser.uid}&theirID=${randomUser.uid}`)
    }
  }
  return (
    <>
      {isUserHadChat ? (
        <div>Chatlist</div>
      ) : (
        <div className="w-full font-mono sm:px-5 lg:px-10 pb-10 border-b border-gray-600">
          <div className="w-full flex flex-col items-center mb-4 px-4 py-2">
            <h1>Let's go find new friend</h1>
            <button onClick={() => searchRandomFriend()} className="btn w-64">
              Search 1 random friend{" "}
            </button>
          </div>
          {randomUser && (
            <div onClick={() => openChatRoom()} className="w-full h-auto flex justify-between items-center px-4 py-2 rounded-md bg-blue-100 cursor-pointer shadow hover:bg-blue-200 hover:shadow-sm">
              <ChatList user={randomUser} />
            </div>
          )}
        </div>
      )}
    </>
  )
}

export async function getServerSideProps(context: any) {
  if (auth.currentUser) {
    const docRef = doc(db, "users", auth.currentUser.uid, "chats")
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return {
        props: {
          isUserHadChat: true
        }
      }
    }
  }
  return {
    props: {
      isUserHadChat: false
    }
  }
}
