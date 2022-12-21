import { auth, db } from "../firebase"
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth"
import { useEffect, useState } from "react"
import { useRecoilState } from "recoil"
import { userState } from "../components/userAtom"
import { doc, getDoc, setDoc } from "firebase/firestore"

export default function Navbar({ theirProfile, whereIsMe }: any) {
  const provider = new GoogleAuthProvider()
  const [user, setUser] = useRecoilState(userState)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    onAuthStateChanged(auth, (user: any) => {
      if (user) {
        setLoading(true)
        const uid = auth.currentUser?.uid
        const fetchUser = async () => {
          // @ts-ignore
          const docRef = doc(db, "users2", uid)
          const docSnap = await getDoc(docRef)
          setLoading(false)
          if (docSnap.exists()) {
            // @ts-ignore
            setUser(docSnap.data())
          }
        }
        fetchUser()
      }
    })
  }, [])
  const signIn = async () => {
    setLoading(true)
    await signInWithPopup(auth, provider)
      .then(async (result) => {
        // @ts-ignore
        const { uid, displayName, photoURL, email } = result.user
        const docRef = doc(db, "users2", uid)
        const docSnap = await getDoc(docRef)
        setLoading(false)
        if (!docSnap.exists()) {
          setDoc(docRef, {
            uid,
            displayName,
            photoURL,
            email
          })
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }
  return (
    <nav className="flex flex-col items-start z-40 px-4 w-full sticky top-0  font-mono bg-blue-300 text-white">
      <div className="w-full flex bg-blue-300 pb-1 pt-3">
        {user ? (
            <div className={`flex-1 w-auto flex justify-start items-center overflow-hidden`}>
              <img
                className="rounded-full w-10 h-10 object-contain cursor-pointer"
                // @ts-ignore
                src={user.photoURL || ""}
                referrerPolicy="no-referrer"
                alt="userImg"
                onClick={async () => {
                  setUser(null)
                  await signOut(auth)
                }}
              />
              <div className="flex-shrink flex flex-col items-start ml-1 sm:ml-2 mr-2 md:mr-0 leading-tight overflow-hidden">
                <p className="text-[13px] sm:text-[15px] md:text-[16px] font-semibold tracking-wider truncate">
                  {/* @ts-ignore */}
                  {user.displayName}
                </p>
                <p className="text-[10px] sm:text-[11px] md:text-[12px] font-semibold tracking-wider truncate">
                  {/* @ts-ignore */}
                  {user.email}
                </p>
              </div>
            </div>
        ) : (
          <button onClick={() => signIn()} className={`${loading ? "animate-pulse" : ""}  btn`}>
            SignIn with Google
          </button>
        )}
      </div>
    </nav>
  )
}
