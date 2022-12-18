import { collection, onSnapshot, orderBy, where,query } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { db } from '../../firebase'
import Input from './Input'
import Message from './Message'

export default function Room({yourID, theirID}:any) {
  const [messages, setMessages] = useState([])
    useEffect(()=>{
        const unsub = onSnapshot(
            query(collection(db, "users", yourID, "chats", theirID, "messages"),orderBy("timestamp","desc")),(snapshot:any)=>{
                setMessages(snapshot.docs)
            }
        )
        return unsub
    },[db])
  return (
    <div className='flex flex-col w-full h-full bg-gray-50 py-5 px-12'>
      {messages.map((message:any)=>(
        <div key={message.id} className={`border w-20 ${message.data().uid === yourID ? 'mr-auto': 'ml-auto'}`}>
          <Message  message={message.data().message} style={``} />
        </div>
      ))}
        <Input/>
    </div>
  )
}
