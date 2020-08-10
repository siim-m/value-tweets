import Head from 'next/head'
import { useEffect, useState } from 'react'

export default function Home() {

  let [tweet, setTweet] = useState({})

  const fetchTweet = () => {
    fetch('/api/get_value_tweet')
      .then(res => res.json())
      .then((data) => {
        setTweet(data)
      })
      .catch(console.log)
  }

  useEffect(() => {
    fetchTweet();
  }, [])



  return (
    <div className="container mx-auto">
      <Head>
        <title>Value Tweets</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col h-full items-center justify-center pt-24">
        <button onClick={fetchTweet}>Refresh</button>
        <h1 className="text-2xl mt-12">{tweet.display_text}</h1>
        <a href={tweet.url_https} className="underline" target="_blank" rel="noopener noreferrer">Original Tweet</a>
        <img className="border border-white rounded-lg mt-12" src={tweet.media_url_https} />
      </main>
    </div>
  )
}
