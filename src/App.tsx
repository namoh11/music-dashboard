import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import ListeningHistory from './ListeningHistory';
import { Box, Button, Grid2, Modal, Typography } from "@mui/material";

function App() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);


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
          <ListeningHistory accessToken={accessToken} />
        </Box>
      </Modal>
    </div>
  );

}

export default App;
