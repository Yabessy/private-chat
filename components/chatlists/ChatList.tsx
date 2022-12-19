import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { userState } from "../../atom/userAtom";
import { db } from "../../firebase";
import { CheckIcon } from "@heroicons/react/24/outline";
import Moment from "react-moment";

export default function ChatList({ user, random }: any) {
  const [currentUser] = useRecoilState(userState);
  const [lastMessgae, setLastMessage] = useState(null);
  useEffect(() => {
    if (user) {
      const unsub = onSnapshot(query(collection(db, "users", currentUser.uid, "chats", user.id, "messages"), orderBy("timestamp", "desc"), limit(1)), (snapshot) => {
        setLastMessage(snapshot.docs[0].data());
      });
    }
  }, []);
  return (
    <>
      <img className="rounded-full mr-4 w-10 h-10 object-contain cursor-pointer" src={user ? user.data().photoURL : random.photoURL} referrerPolicy="no-referrer" alt="" />
      <div className="flex flex-col items-start flex-grow leading-tight">
        <h1 className="text-[16px]">{user ? user.name : random.name}</h1>
        <div className="text-[14px] flex items-center text-gray-600">
          {user ? lastMessgae?.message : ""}{" "}
          {lastMessgae?.uid === currentUser?.uid ? (
            <div className="relative w-5 h-5 pb-2">
              <CheckIcon className="absolute left-0.5 h-4 text-green-500 ml-2" />
              <CheckIcon className="absolute left-2 h-4 text-green-500 ml-2" />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      <span className="mt-auto text-[15px] text-gray-600">
        {user ? (
          <Moment fromNow>
             {lastMessgae?.timestamp.toDate()} 
          </Moment>
        ) : (
          ""
        )}
      </span>
    </>
  );
}
