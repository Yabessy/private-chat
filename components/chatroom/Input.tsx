import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { db } from "../../firebase";

export default function Input({ yourID, theirID }: any) {
  const [input, setInput] = useState("");
  async function sendMessage() {
    setInput("");
    if(!input) return;
    await addDoc(
      collection(db, "users", yourID, "chats", theirID, "messages"),
      {
        message: input,
        timestamp: serverTimestamp(),
        uid: yourID,
      }
    ); 
    await addDoc(
      collection(db, "users", theirID, "chats", yourID, "messages"),
      {
        message: input,
        timestamp: serverTimestamp(),
        uid: yourID,
      }
    );
  }
  return (
    <div className="absolute bottom-0 inset-x-0 w-full h-16 px-10 pb-5">
      <div className="relative w-full h-full rounded-md">
        <textarea
          className="absolute inset-0 bg-blue-100 rounded-md pl-2 focus:outline-none pr-20 pt-1 border border-blue-400"
          placeholder="Type your message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={() => sendMessage()}
          className="absolute right-2.5 z-10 top-2.5 px-2  btn"
        >
          Send
        </button>
      </div>
    </div>
  );
}
