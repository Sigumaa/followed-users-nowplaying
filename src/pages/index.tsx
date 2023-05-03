import React from 'react';
import useSWR from "swr";

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
      <h1>Followers</h1>
      <hr />
      {data.map((user) => (
        <div>
          <img src={user.image !== "" ? user.image : "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.jpg"} width="100" height="100"  alt={user.name}/>
          <div style={{display: "inline-block", marginLeft: "0.5rem"}}>
            <p><a href={user.url} style={{marginLeft: "0.5rem", fontSize: "1rem", textDecoration: "none",paddingBottom: "3rem"}}>{user.name}</a> Now Playing</p>
          </div>
          <hr />
        </div>
      ))}
    </div>
  );
}