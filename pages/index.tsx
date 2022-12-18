import type { NextPage } from "next"
import Head from "next/head"
import { useRecoilState } from "recoil"
import { Chatlists, Navbar } from "../components"
import { userState } from "../atom/userAtom"

const Home: NextPage = () => {
  const [currentUser] = useRecoilState(userState)
  return (
    <div>
      <Head>
        <title>Private Chat Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-full h-[720px] sm:h-[1080px] lg:h-screen flex flex-col items-center bg-blue-50">
        <Navbar />
        {currentUser ? (
          <Chatlists />
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-4xl font-medium text-gray-400">
              not loged in...
            </h1>
          </div>
        )}
      </main>
    </div>
  )
}

export default Home
