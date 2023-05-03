import React from 'react';
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Music({user}: {user: string}) {
  const {data,error} = useSWR("/api/np/" + user, fetcher);

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  const {artist,name,album,url} = data;
  const nowplaying = Boolean(artist || name || album || url);

  return (
    <div style={{display: "inline-block", marginLeft: "1rem" }}>
      <p style={{display: "block"}}> <a href={`https://www.last.fm/user/${user}`} style={{textDecoration: "none"}}>{user}</a> {nowplaying ? "" : "Not "}Listening to Music</p>
      <div style={{ display: nowplaying ? "block" : "none" }}>
        <p>Name: {name}</p>
        <p>Artist: {artist}</p>
        <p>
          Music URL: <a href={url}>last.fm</a>
        </p>
      </div>
    </div>
  );
}
