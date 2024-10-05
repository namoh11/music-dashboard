import React, { useEffect, useState } from 'react';
import { getUserAccessToken } from './spotifyServiceRevised';
import { List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

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
    const fetchAccessToken = async () => {
      try {
        // The authorization code would ideally be obtained from the Spotify authorization process
        const code = 'YOUR_AUTH_CODE'; // You need to replace this with the actual authorization code.

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
  }, []);

  const fetchListeningHistory = async (token: string) => {
    try {
      const response = await axios.get('https://api.spotify.com/v1/me/player/recently-played', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          limit: 10,
        },
      });
      setTracks(response.data.items);
    } catch (error) {
      console.error('Error fetching listening history:', error);
    }
  };

  return (
    <div>
      <h1>Spotify Listening History</h1>
      {accessToken ? (
        <List>
          {tracks.length > 0 ? (
            tracks.map((track, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={track.track.name}
                  secondary={track.track.artists.map(artist => artist.name).join(', ')}
                />
              </ListItem>
            ))
          ) : (
            <p>No listening history available.</p>
          )}
        </List>
      ) : (
        <p>Loading access token...</p>
      )}
    </div>
  );
};

export default App;
