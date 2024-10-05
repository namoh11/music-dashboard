import React, { useEffect, useState } from 'react';
import { getListeningHistory } from './spotifyService';  // Import from spotifyService.ts
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

interface ListeningHistoryProps {
  accessToken: string;
}

const ListeningHistory: React.FC<ListeningHistoryProps> = ({ accessToken }) => {
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    const fetchListeningHistory = async () => {
      try {
        const history = await getListeningHistory(accessToken);
        setTracks(history);
      } catch (error) {
        console.error('Error fetching listening history:', error);
      }
    };

    if (accessToken) {
      fetchListeningHistory();
    }
  }, [accessToken]);

  if (!tracks.length) {
    return <p>No listening history available.</p>;
  }

  return (
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
  );
};

export default ListeningHistory;
