import React, { useEffect, useState } from 'react';
import { getListeningHistory } from './spotifyServiceRevised';
import { Box, Card, CardMedia, CardContent, Typography, Grid } from '@mui/material';

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
  const [listeningHistory, setListeningHistory] = useState<Track[]>([]);

  useEffect(() => {
    const fetchListeningHistory = async () => {
      if (accessToken) {
        const tracks = await getListeningHistory(accessToken);
        setListeningHistory(tracks);
      }
    };

    fetchListeningHistory();
  }, [accessToken]);

  return (
    <Box mt={5} mx={3}>
      <Typography variant="h4" gutterBottom>
        Recently Played Tracks
      </Typography>
      <Grid container spacing={3}>
        {listeningHistory.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={item.track.album.images[0]?.url ?? 'https://via.placeholder.com/200'}
                alt={item.track.name}
              />
              <CardContent>
                <Typography variant="h6">{item.track.name}</Typography>
                <Typography variant="subtitle1">
                  Artist: {item.track.artists.map(artist => artist.name).join(', ')}
                </Typography>
                <Typography variant="subtitle2">
                  Album: {item.track.album.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ListeningHistory;
