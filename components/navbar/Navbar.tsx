import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth"
import React, { useEffect } from "react"
import { auth } from "../../firebase"
import { useRouter } from "next/router"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "../../firebase"
import { useRecoilState } from "recoil"
import { userState } from "../../atom/userAtom"

export default function Navbar({ theirProfile }: any) {
  const [currentUser, setCurrentUser] = useRecoilState(userState)
  const router = useRouter()
  async function googleSignIn() {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
      .then(async (result) => {
        await setDoc(doc(db, "users", result.user.uid), {
          uid: result.user.uid,
          name: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL
        })
        router.push("/")
      })
      .catch((error) => {
        console.log(error)
      })
  }
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      const uid = auth.currentUser?.uid
      if (user) {
        const fetchUser = async () => {
          // @ts-ignore
          const docRef = doc(db, "users", uid)
          const docSnap = await getDoc(docRef)
          if (docSnap.exists()) {
            // @ts-ignore
            setCurrentUser(docSnap.data())
          }
        }
        fetchUser()
      }
    })
  }, [])
  return (
    <nav className="z-40 w-full flex sticky top-0 px-4 py-4 font-mono bg-blue-300 text-white">
      {currentUser ? (
        <>
          <div className="flex-1 w-auto flex justify-start items-center overflow-hidden">
            <img
              className="rounded-full w-10 h-10 object-contain cursor-pointer"
              // @ts-ignore
              src={currentUser.photoURL || ""}
              referrerPolicy="no-referrer"
              alt="userImg"
              onClick={async () => {
                setCurrentUser(null)
                await signOut(auth)
                router.push("/")
              }}
            />
            <div className="flex-shrink flex flex-col items-start ml-1 sm:ml-2 mr-2 md:mr-0 leading-tight overflow-hidden">
              <p className="text-[13px] sm:text-[15px] md:text-[16px] font-semibold tracking-wider truncate">
                {/* @ts-ignore */}
                {currentUser.name}
              </p>
              <p className="text-[10px] sm:text-[11px] md:text-[12px] font-semibold tracking-wider truncate">
                {/* @ts-ignore */}
                {currentUser.email}
              </p>
            </div>
          </div>

          {/* THEIR PROFILE */}
          {theirProfile && (
            <div className="flex-1 w-auto flex justify-end items-center overflow-hidden">
              <div className="flex-shrink flex flex-col items-end mr-1 sm:mr-2 ml-2 md:ml-0 leading-tight overflow-hidden">
                <p className="text-[13px] sm:text-[15px] md:text-[16px]text-[16px] font-semibold tracking-wider truncate">{theirProfile.name}</p>
                <p className="text-[13px] sm:text-[15px] md:text-[16px]text-[12px] font-semibold tracking-wider truncate">{theirProfile.email}</p>
              </div>
              <img
                src={theirProfile.photoURL || ""}
                referrerPolicy="no-referrer"
                alt="userImg"
                className="rounded-full w-10 h-10 object-contain"
              />
            </div>
          )}
        </>
      ) : (
        <button onClick={() => googleSignIn()} className="bg-blue-400 text-white font-bold px-4 rounded-lg cursor-pointer shadow-md hover:shadow-sm">
          SignIn
        </button>
      )}
    </nav>
  )
}
