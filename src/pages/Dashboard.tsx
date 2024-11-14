import { Button, Container, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

type Props = {};

const Dashboard = (props: Props) => {
  const navigate = useNavigate();
  return (
    <Container>
      <Typography>Book now!</Typography>
      <Button variant="outlined" onClick={() => navigate("/book")}>
        Book a slot
      </Button>
    </Container>
  );
};

export default Dashboard;
