import Input from "./Input"
import Message from "./Message"

export default function ChatRoom({ id, users }: any) {
  console.log(id, users)
  return (
    <div>
      <Message />
      <Input chatRoom={id} />
    </div>
  )
}
