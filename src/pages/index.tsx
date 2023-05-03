import React from 'react';
import useSWR from "swr";
import Music from './music';

type UserData = {
  name: string;
  url: string;
  image: string;
}
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const {data,error} = useSWR<UserData[]>("/api/user", fetcher);

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>


  return (
    <div>
      <img src={"https://lastfm.freetls.fastly.net/i/u/avatar170s/fb715f02eab6d7b0f5f13632cf2566f9.png"} alt={"shiyui"} style={{verticalAlign: "top"}} />
      <Music user={"shiyui"} />
      <hr />
      {data.map((user) => (
        <div>
          <img src={user.image !== "" ? user.image : "https://lastfm.freetls.fastly.net/i/u/avatar170s/818148bf682d429dc215c1705eb27b98.png"} alt={user.name} style={{verticalAlign: "top"}} />
          <Music user={user.name}  />
          <hr />
        </div>
      ))}
    </div>
  );
}
