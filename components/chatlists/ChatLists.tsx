import { addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { auth, db } from "../../firebase";
import { userState } from "../../atom/userAtom";
import ChatList from "./ChatList";
import { useRouter } from "next/router";
import { map } from "@firebase/util";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function Chatlists() {
  const router = useRouter();
  const [randomUser, setRandomUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [currentUser] = useRecoilState(userState);

  useEffect(() => {
    const unsub = getDocs(collection(db, "users", currentUser.uid, "chats")).then((snapshot) => {
      setChats(snapshot.docs);
    });
  }, [db]);

  async function searchRandomFriend() {
    console.log("searching...");
    const usersRef = collection(db, "users");
    // @ts-ignore
    const q = query(usersRef, where("uid", "!=", currentUser?.uid));
    const querySnapshot = await getDocs(q);
    try {
      const randomNum = Math.floor(Math.random() * querySnapshot.docs.length);
      // @ts-ignore
      setRandomUser(querySnapshot.docs[randomNum].data());
    } catch (e) {
      console.log(e);
    }
  }
  async function openRChatRoom() {
    const docRef = doc(db, "users", currentUser.uid, "chats", randomUser.uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      await setDoc(docRef, {
        uid: randomUser.uid,
        name: randomUser.name,
        photoURL: randomUser.photoURL,
      });
      await setDoc(doc(db, "users", randomUser.uid, "chats", currentUser.uid), {
        uid: currentUser.uid,
        name: currentUser.name,
        photoURL: currentUser.photoURL,
      });
      await addDoc(collection(db, "users", currentUser.uid, "chats", randomUser.uid, "messages"), {
        uid: currentUser.uid,
        message: "Hello",
        timestamp: serverTimestamp(),
      })
        .then(() => router.push(`/chatroom?theirID=${randomUser.uid}`))
        .catch((e) => console.log(e));
    } else {
      router.push(`/chatroom?theirID=${randomUser.uid}`);
    }
  }
  async function openChatRoom(chat: any) {
    router.push(`/chatroom?theirID=${chat.id}`);
  }
  return (
    <div className="w-full font-mono px-4">
      <div className="w-full  sm:px-5 lg:px-10 pb-10 border-b border-gray-600">
        <div className="w-full flex flex-col items-center mb-4  py-2">
          <h1>Let's go find new friend</h1>
          <button onClick={() => searchRandomFriend()} className="btn w-64">
            Search 1 random friend{" "}
          </button>
        </div>
        {randomUser && (
          <div
            onClick={() => openRChatRoom()}
            className="relative w-full h-auto flex justify-between items-center px-4 py-2 rounded-md bg-blue-100 cursor-pointer shadow hover:bg-blue-200 hover:shadow-sm">
            <ChatList random={randomUser} />
            <XMarkIcon
              className="h-6 w-6 absolute right-2 top-2 text-gray-500 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setRandomUser(null);
              }}
            />
          </div>
        )}
      </div>
      <div className="mt-2">
        {chats.length > 0 && (
          <div className="">
            {chats.map((chat) => (
              <div
                onClick={() => openChatRoom(chat)}
                key={chat.id}
                className="w-full h-auto flex justify-between items-center px-4 py-2 rounded-md bg-blue-100 cursor-pointer shadow hover:bg-blue-200 hover:shadow-sm">
                <ChatList user={chat} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
