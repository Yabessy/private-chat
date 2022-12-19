import { EllipsisHorizontalIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { collection, onSnapshot, orderBy, where, query, deleteDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import Input from "./Input";
import Message from "./Message";

export default function Room({ yourID, theirID }: any) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, "users", yourID, "chats", theirID, "messages"), orderBy("timestamp", "desc")), (snapshot: any) => {
      setMessages(snapshot.docs);
    });
    return unsub;
  }, [db]);
  return (
    <div className="flex flex-col w-full h-full  bg-gray-50 py-4 px-4 md:px-12 relative">
      <div className="flex flex-col w-full h-[560px] lg:h-[500px] overflow-y-scroll scrollbar-none">
        {messages.map((message: any) => (
          <div key={message.id} className={`border mb-5 py-2 px-4 h-auto w-auto max-w-[90%] sm:max-w-[75%] md:max-w-[60%] lg:max-w-[55%] rounded-xl bg-blue-100 ${message.data().uid === yourID ? "mr-auto" : "ml-auto text-right"}`}>
            <Message yourID={yourID} theirID={theirID} message={message}/>
          </div>
        ))}
      </div>
      <Input yourID={yourID} theirID={theirID} />
    </div>
  );
}
