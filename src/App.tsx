import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { Box, Button, Grid, Modal, Typography } from "@mui/material";

function App() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className="App">
      {/* Logo Section */}
      <img src={logo} alt="Spotify Logo" style={{ width: "100px", height: "auto", marginBottom: "20px" }} />

      {/* Main Content Section */}
      <Grid
        container
        flexGrow={1}
        justifyContent="center"
        alignItems="center"
      >
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
              position: "absolute",
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
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              I am some sample text
            </Typography>
          </Box>
        </Modal>
      </Grid>
    </div>
  );
}

export default App;
