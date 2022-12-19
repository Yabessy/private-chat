import React from "react";

export default function ChatList({ user, random }: any) {
  return (
    <>
      <img className="rounded-full mr-3 w-10 h-10 object-contain cursor-pointer" src={user ? user.data().photoURL : random.photoURL} referrerPolicy="no-referrer" alt="" />
      <div className="flex flex-col items-start flex-grow leading-tight">
        <h1 className="text-[16px]">{user ? user.name : random.name}</h1>
        <p className="text-[14px] text-gray-600">last message</p>
      </div>
      <span className="mt-auto text-[15px] text-gray-600">17h ago</span>
    </>
  );
}
