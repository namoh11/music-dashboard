import React from "react";
import logo from './Spotify_Primary_Logo_RGB_Black.png';
import "./App.css";
import { Box, Button, Grid, Modal, Typography } from "@mui/material";

function App() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <Grid
      container
      className="App"
      flexGrow={1}
      justifyContent={"center"}
      alignItems="center"
    >
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            I am some sample text
          </Typography>
          <Typography id="modal-modal-description">
            I am some sample text
          </Typography>
        </Box>
      </Modal>
    </Grid>
  );
}

export default App;