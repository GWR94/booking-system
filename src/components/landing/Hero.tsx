import { Box, Container, Typography, Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #1976d2 0%, #42a5a5 100%)",
        color: "white",
        py: 10,
        textAlign: "center",
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h2" sx={{ margin: "40px 0 20px" }}>
          Tee Up Your Perfect Game
        </Typography>
        <Typography variant="h4" gutterBottom>
          Indoor Golf Simulator Experience
        </Typography>
        <Typography
          variant="body1"
          sx={{ maxWidth: 600, margin: "0 auto 20px" }}
        >
          Practice, play, and improve your golf game in our state-of-the-art
          simulator facility. Four private Trackman booths await to elevate your
          golfing experience.
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={() => navigate("/book")}
        >
          Book a Simulator
        </Button>
      </Container>
    </Box>
  );
};

export default Hero;
