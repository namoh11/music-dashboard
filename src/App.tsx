import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import ListeningHistory from './ListeningHistory';
import { Box, Button, Modal, Typography } from "@mui/material";
import { getUserAccessToken } from './spotifyServiceRevised';

function App() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccessToken = async () => {
      // Replace with actual parameters for authorization code, redirect URI, etc.
      const code = "YOUR_AUTH_CODE";
      const redirectUri = "YOUR_REDIRECT_URI";
      const clientId = "YOUR_CLIENT_ID";
      const clientSecret = "YOUR_CLIENT_SECRET";
      const token = await getUserAccessToken(code, redirectUri, clientId, clientSecret);
      setAccessToken(token);
    };

    fetchAccessToken();
  }, []);

  return (
    <div className="App">
      <Button onClick={handleOpen} variant="contained" color="primary">
        Open modal
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2" gutterBottom>
            Recently Played Tracks
          </Typography>
          {accessToken && <ListeningHistory accessToken={accessToken} />}
        </Box>
      </Modal>
    </div>
  );
}

export default App;
