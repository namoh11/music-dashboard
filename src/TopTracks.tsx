import React, { useEffect, useState } from 'react';
import { getTopTracks } from './spotifyServiceRevised';  
import { List, ListItem, ListItemText, Typography } from '@mui/material';

interface TopTrack {
  name: string;
  album: {
    images: { url: string }[];  
    name: string;               
  };
  artists: { name: string }[];   
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
        setTracks(topTracks);  
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
    <div style={{ textAlign: 'center' }}> {/* Center the whole list */}
      <Typography variant="h4" style={{ marginBottom: '20px' }}>Top Tracks</Typography>
      <List style={{ display: 'inline-block', textAlign: 'left' }}> {/* Inline-block to center the list, left-align individual items */}
        {tracks.map((track, index) => (
          <ListItem key={index} style={{ justifyContent: 'center' }}> {/* Center the content inside each item */}
            <ListItemText
              primary={track.name}
              secondary={track.artists.map(artist => artist.name).join(', ')}
              style={{ textAlign: 'center' }}  
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default TopTracks;
