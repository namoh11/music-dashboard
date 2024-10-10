import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Drawer, List, ListItemText, Divider, Button } from '@mui/material';
import Grid2 from '@mui/material/Grid2'; // Stable import for Grid2
import { ReactComponent as Logo } from './logo.svg'; 
import { getListeningHistory, getUserAccessToken, Track, getTopTracks } from './spotifyServiceRevised';
import TopTracks from './TopTracks'; // Import TopTracks component

const App = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showTopTracks, setShowTopTracks] = useState(false); // State to control showing TopTracks

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (!code) {
      const clientId = process.env.REACT_APP_CLIENT_ID;
      const redirectUri = process.env.REACT_APP_REDIRECT_URI;
      const scopes = 'user-read-recently-played user-top-read'; // Added user-top-read scope

      if (clientId && redirectUri) {
        const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}`;
        window.location.href = authUrl;
      } else {
        console.error('Missing client ID or redirect URI');
      }
    } else {
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

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  const handleShowTopTracks = () => {
    setShowTopTracks(!showTopTracks); // Toggle the visibility of TopTracks
  };

  if (!accessToken) {
    return <p>Loading access token...</p>;
  }

  if (!tracks.length) {
    return <p>No listening history available.</p>;
  }

  return (
    <Grid2 container sx={{ height: '90vh', backgroundColor: '#f5f5f5' }}>
      {/* AppBar */}
      <Grid2>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Spotify Listening History
            </Typography>
            <Button color="inherit" onClick={handleShowTopTracks}>
              {showTopTracks ? 'Hide Top Tracks' : 'Show Top Tracks'}
            </Button>
          </Toolbar>
        </AppBar>

        <Drawer anchor="left" open={drawerOpen} onClose={() => toggleDrawer(false)}>
          <List>
            <ListItemText primary="Fetch Listening History" onClick={() => fetchListeningHistory(accessToken!)} />
            <ListItemText primary="Show Top Tracks" onClick={handleShowTopTracks} />
          </List>
          <Divider />
        </Drawer>
      </Grid2>

      {/* Main Content */}
      <Grid2 sx={{ padding: 2 }}>
        <div>
          <Logo style={{ width: '150px', height: 'auto' }} />
          <h1>Spotify Listening History</h1>
          <div>
            {tracks.map((track, index) => (
              <div key={index}>
                <Typography variant="body1">{track.track.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {track.track.artists.map(artist => artist.name).join(', ')}
                </Typography>
              </div>
            ))}
          </div>
        </div>

        {/* Conditional rendering of TopTracks component */}
        {showTopTracks && <TopTracks accessToken={accessToken} />}
      </Grid2>
    </Grid2>
  );
};

export default App;
