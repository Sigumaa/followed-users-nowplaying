import { NextApiRequest, NextApiResponse } from 'next';

type RecentTrack = {
  artist: {
    mbid: string;
    "#text": string;
  };
  streamable: string;
  image: {
    size: string;
    "#text": string;
  }[];
  mbid: string;
  album: {
    mbid: string;
    "#text": string;
  };
  name: string;
  "@attr": {
    nowplaying: string;
  };
  url: string;
  date: {
    uts: string;
    "#text": string;
  };
};

type RecentTracksAttr = {
  user: string;
  totalPages: string;
  page: string;
  perPage: string;
  total: string;
};

type RecentTracksData = {
  recenttracks: {
    track: RecentTrack[];
    "@attr": RecentTracksAttr;
  };
};

type NowPlayingTrack = {
  artist: string;
  Streamable: string;
  image: string;
  mbid: string;
  album: string;
  name: string;
  url: string;
  date: {
    uts: string;
    "#text": string;
  };
};

const { LASTFM_API_KEY: key } = process.env;

async function getNowPlayingTrack(id: string): Promise<NowPlayingTrack | null> {
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${id}&api_key=${key}&format=json&limit=1`;
  const res = await fetch(url);
  const data: RecentTracksData = await res.json();

  if (
    data.recenttracks.track.length === 0 ||
    data.recenttracks.track[0]['@attr'].nowplaying !== 'true'
  ) {
    return null;
  }

  const track = data.recenttracks.track[0];

  return {
    artist: track.artist["#text"],
    Streamable: track.streamable,
    image: track.image[2]["#text"],
    mbid: track.mbid,
    album: track.album["#text"],
    name: track.name,
    url: track.url,
    date: track.date,
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<NowPlayingTrack | { isPlaying: false }>
) {
  const id = req.query.id as string;
  console.log(id);
  try {
    const track = await getNowPlayingTrack(id);
    if (track) {
      res.status(200).json(track);
    } else {
      res.status(200).json({ isPlaying: false });
    }
  } catch (error) {
    res.status(500).json({ isPlaying: false });
  }
}
