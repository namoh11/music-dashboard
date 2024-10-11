import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Drawer, List, ListItemText, Divider, Button, CssBaseline } from '@mui/material';
import Grid2 from '@mui/material/Grid2'; // Stable import for Grid2
import { ReactComponent as Logo } from './logo.svg';
import { getListeningHistory, getUserAccessToken, Track } from './spotifyServiceRevised';
import TopTracks from './TopTracks'; // Import TopTracks component
import { ThemeProvider, createTheme } from '@mui/material/styles'; // Import ThemeProvider and createTheme
import { themeOptions } from './theme'; // Import your custom theme

const theme = createTheme(themeOptions); // Create the theme

const App = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showTopTracks, setShowTopTracks] = useState(false); // State to control showing TopTracks
  const [showListeningHistory, setShowListeningHistory] = useState(false); // State to control showing Listening History

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (!code) {
      const clientId = process.env.REACT_APP_CLIENT_ID;
      const redirectUri = process.env.REACT_APP_REDIRECT_URI;
      const scopes = 'user-read-recently-played user-top-read'; 

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

  const handleShowListeningHistory = () => {
    setShowListeningHistory(!showListeningHistory); // Toggle the visibility of Listening History
  };

  if (!accessToken) {
    return <p>Loading access token...</p>;
  }

  return (
    <>
      {/* AppBar */}
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Spotify Dashboard
          </Typography>
          <Button color="inherit" onClick={handleShowTopTracks}>
            {showTopTracks ? 'Hide Top Tracks' : 'Show Top Tracks'}
          </Button>
          <Button color="inherit" onClick={handleShowListeningHistory}>
            {showListeningHistory ? 'Hide Listening History' : 'Show Listening History'}
          </Button>
        </Toolbar>
      </AppBar>

      {/* Add margin to avoid AppBar overlapping content */}
      <Toolbar />

      <Grid2 container sx={{ height: '90vh', backgroundColor: '#000000', padding: 2 }}>
        {/* Main Content */}
        <Grid2 xs={12}>
          <div>
            <Logo style={{ width: '150px', height: 'auto' }} />
            <h1>Spotify Dashboard</h1>
            {/* Listening history only shows when the button is pressed */}
            {showListeningHistory && (
              <div>
                {tracks.length > 0 ? (
                  tracks.map((track, index) => (
                    <div key={index}>
                      <Typography variant="body1">{track.track.name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {track.track.artists.map(artist => artist.name).join(', ')}
                      </Typography>
                    </div>
                  ))
                ) : (
                  <p>No listening history available.</p>
                )}
              </div>
            )}
          </div>

          {/* Top tracks only show when the button is pressed */}
          {showTopTracks && <TopTracks accessToken={accessToken} />}
        </Grid2>
      </Grid2>
    </>
  );
};

// Wrap App component with ThemeProvider
const RootApp = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />  {/* Adds base CSS resets for consistent styling */}
    <App />
  </ThemeProvider>
);

export default RootApp;
