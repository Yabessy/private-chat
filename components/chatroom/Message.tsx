
export default function Message({message,style}:any) {
  return (
    <div className={`flex-[9] flex ${style}`}>
        <h1 className="">
          {message}
        </h1>
    </div>
  )
}
