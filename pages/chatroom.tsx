import Head from "next/head"
import { Navbar, Room } from "../components"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"

export default function chatroom({yourID, theirID}:any) {
  const router = useRouter()
  const [theirProfile, setTheirProfile] = useState<any>(null)
  useEffect(() => {
    async function checkTheirProfile(pyourID:any, ptheirID:any) {
      const docRef = doc(db, "users", pyourID, "chats", ptheirID)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setTheirProfile(docSnap.data())
      }
    }
    checkTheirProfile(yourID, theirID)
  }, [])
  return (
    <div>
      <Head>
        <title>Private Chat Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-full h-[720px] sm:h-[1080px] lg:h-screen flex flex-col items-center bg-gray-50 font-mono">
        <Navbar theirProfile={theirProfile}/>
        <Room yourID={yourID} theirID={theirID}/>
      </main>
    </div>
  )
}

export async function getServerSideProps(context: any) {
  const { yourID, theirID } = context.query
  return {
    props: {
      yourID,
      theirID
    }
  }
}
