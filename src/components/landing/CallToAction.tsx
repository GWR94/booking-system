import { Box, Container, Typography, Button } from "@mui/material";
import React from "react";

const CallToAction = () => (
  <Box
    sx={{
      bgcolor: "primary.main",
      color: "white",
      py: 10,
      textAlign: "center",
    }}
  >
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Ready to Improve Your Golf Game?
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Book a simulator booth and take your golf skills to the next level.
      </Typography>
      <Button variant="contained" color="secondary" size="large">
        Book Now
      </Button>
    </Container>
  </Box>
);

export default CallToAction;
