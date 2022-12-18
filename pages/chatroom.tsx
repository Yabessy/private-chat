import Head from "next/head";
import { Navbar, Room } from "../components";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { userState } from "../atom/userAtom";
import { useRecoilState } from "recoil";
import { onAuthStateChanged } from "firebase/auth";

export default function chatroom({ theirID }: any) {
  const router = useRouter();
  const [currentUserID, setCurrentUserID] = useState(null);
  const [theirProfile, setTheirProfile] = useState<any>(null);
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/");
        
      } else {
        setCurrentUserID(user.uid);
        const docRef = doc(db, "users", user.uid, "chats", theirID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTheirProfile(docSnap.data());
        }
      }
    });
  }, []);
  return (
    <div>
      <Head>
        <title>Private Chat Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-full h-[720px] sm:h-[1080px] lg:h-screen flex flex-col items-center bg-gray-50 font-mono">
        {currentUserID && theirProfile && (
          <>
            <Navbar theirProfile={theirProfile} />
            <Room yourID={currentUserID} theirID={theirID} />
          </>
        )}
      </main>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const { theirID } = context.query;
  return {
    props: {
      theirID,
    },
  };
}
