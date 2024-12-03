import React from "react";
import { Box } from "@mui/material";
import NavBar from "../components/common/NavBar";
import Features from "../components/landing/Features";
import Hero from "../components/landing/Hero";
import Testimonials from "../components/landing/Testimonials";
import CallToAction from "../components/landing/CallToAction";

type Props = {};

const Landing = (props: Props) => {
  return (
    <Box>
      <Hero />
      <Features />
      <Testimonials />
      <CallToAction />
    </Box>
  );
};

export default Landing;
