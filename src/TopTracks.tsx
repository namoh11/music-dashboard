import React, { useEffect, useState } from 'react';
import { getTopTracks } from './spotifyServiceRevised';  // Import getTopTracks function
import { List, ListItem, ListItemText } from '@mui/material';


interface TopTrack {
  name: string;
  album: {
    images: { url: string }[];  // Array of album images
    name: string;               // Album name
  };
  artists: { name: string }[];   // Array of artists
}

interface TopTracksProps {
  accessToken: string;
}

const TopTracks: React.FC<TopTracksProps> = ({ accessToken }) => {
  const [tracks, setTracks] = useState<TopTrack[]>([]);

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        const topTracks = await getTopTracks(accessToken);
        setTracks(topTracks);  // structure's off, might have to retailor the data i take 
      } catch (error) {
        console.error('Error fetching top tracks:', error);
      }
    };

    if (accessToken) {
      fetchTopTracks();
    }
  }, [accessToken]);

  if (!tracks.length) {
    return <p>No top tracks available.</p>;
  }

  return (
    <List>
      {tracks.map((track, index) => (
        <ListItem key={index}>
          <ListItemText
            primary={track.name}
            secondary={track.artists.map(artist => artist.name).join(', ')}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default TopTracks;
