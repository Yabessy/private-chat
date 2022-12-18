import Moment from "react-moment";

export default function Message({message,style,timestamp}:any) {
  return (
    <div className={`flex flex-col w-full ${style}`}>
        <h1 className={`text-xl tracking-wider order-1`}>
          {message}
        </h1>
        <span className={`text-[12px] tracking-tight mt-auto order-2`}>
          <Moment fromNow >
            {timestamp?.toDate()}
          </Moment>
        </span>
    </div>
  )
}
