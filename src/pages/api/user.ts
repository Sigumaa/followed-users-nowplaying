import {NextApiRequest, NextApiResponse} from 'next';

type FriendsData = {
  friends: Friends;
}

type Friends = {
  '@attr': Attr;
  user: User[];
};

type Attr = {
  perPage: string;
  totalPages: string;
  page: string;
  total: string;
  user: string;
};

type User = {
  name: string;
  url: string;
  country: string;
  playlists: string;
  playcount: string;
  image: Image[];
  registered: Registered;
  realname: string;
  subscriber: string;
  bootstrap: string;
  type: string;
};

type Image = {
  size: string;
  '#text': string;
};

type Registered = {
  unixtime: string;
  '#text': string;
};

type UserData = {
  name: string;
  url: string;
  image: string;
}

const {
  LASTFM_API_KEY: key,
  LASTFM_USER: user,
} = process.env;

async function GetFriends(): Promise<UserData[] | null> {
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getfriends&user=${user}&api_key=${key}&format=json`;
  const res = await fetch(url);
  const friends: FriendsData = await res.json();
  if (!friends.friends) {
    return null;
  }
  if (friends.friends['@attr'].total === "0") {
    return null;
  }

  return friends.friends.user.map((user) => {
      return {
        name: user.name,
        url: user.url,
        image: user.image[2]['#text'],
      };
    }
  );
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserData[] | { message: string }>
) {
  try {
    if (!key || !user) {
      console.error("Missing LASTFM_API_KEY or LASTFM_USER!!!");
    }
    const friends = await GetFriends();
    if (friends) {
      res.status(200).json(friends);
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
}
