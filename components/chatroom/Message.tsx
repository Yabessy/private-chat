import { EllipsisHorizontalIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import Moment from "react-moment";
import { useState } from "react";

export default function Message({ yourID, theirID, message }: any) {
  const [menu, toggleMenu] = useState(false);
  async function deleteMessage() {
    await deleteDoc(doc(db, "users", yourID, "chats", theirID, "messages", message.id));
  }
  return (
    <div className={`flex flex-col overflow-hidden flex-wrap h-full w-full ${message.data().uid === yourID ? "justify-start" : "justify-end"}`}>
      <span className={`text-sm sm:text-base md:text-lg tracking-wider order-1`}>{message?.data().message}</span>
      <span className={`flex items-center text-[12px] tracking-tight mt-auto order-2`}>
        <Moment fromNow>{message?.data().timestamp?.toDate()}</Moment>
        <XMarkIcon className="h-5 flex cursor-pointer ml-2" onClick={() => deleteMessage()} />
      </span>
    </div>
  );
}
