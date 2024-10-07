import React, { useEffect, useState } from 'react';
import { getListeningHistory, getUserAccessToken } from './spotifyServiceRevised';
import { List, ListItem, ListItemText } from '@mui/material';

interface Track {
  track: {
    name: string;
    album: {
      images: { url: string }[];
      name: string;
    };
    artists: { name: string }[];
  };
}

const App = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (!code) {
      // Redirect user to Spotify authorization URL if no code is present
      const clientId = process.env.REACT_APP_CLIENT_ID;
      const redirectUri = process.env.REACT_APP_REDIRECT_URI;
      const scopes = 'user-read-recently-played';

      if (clientId && redirectUri) {
        const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}`;
        window.location.href = authUrl;
      } else {
        console.error('Missing client ID or redirect URI');
      }
    } else {
      // Fetch the access token with the code if present
      const fetchAccessToken = async () => {
        try {
          const token = await getUserAccessToken(code);
          if (token) {
            setAccessToken(token);
            fetchListeningHistory(token);
          } else {
            console.error('Failed to retrieve access token');
          }
        } catch (error) {
          console.error('Error fetching access token:', error);
        }
      };

      fetchAccessToken();
    }
  }, []);

  const fetchListeningHistory = async (token: string) => {
    try {
      const history = await getListeningHistory(token);
      setTracks(history);
    } catch (error) {
      console.error('Error fetching listening history:', error);
    }
  };

  if (!accessToken) {
    return <p>Loading access token...</p>;
  }

  if (!tracks.length) {
    return <p>No listening history available.</p>;
  }

  return (
    <div>
      <h1>Spotify Listening History</h1>
      <List>
        {tracks.map((track, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={track.track.name}
              secondary={track.track.artists.map(artist => artist.name).join(', ')}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default App;
