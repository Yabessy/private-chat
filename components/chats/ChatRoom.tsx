import Input from "./Input"
import Message from "./Message"

export default function ChatRoom({ chat }: any) {
  console.log(chat.id)
  return (
    <div className="flex flex-col">
      <div className="flex">
        <img
          src={chat.data().theirImg}
          alt=""
          className="h-7 rounded-full"
        />
        <h1>{chat.data().theirName}</h1>
      </div>
      <Message chatRoom={chat.id}/>
      <Input chatRoom={chat.id} />
    </div>
  )
}
