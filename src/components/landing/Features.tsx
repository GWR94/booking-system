import {
  Avatar,
  Box,
  Container,
  Grid2 as Grid,
  Typography,
} from "@mui/material";
import {
  Group as GroupIcon,
  SportsGolf as SportsGolfIcon,
  EventAvailable as EventAvailableIcon,
  LocationOn as LocationOnIcon,
} from "@mui/icons-material";

const simulatorFeatures = [
  {
    icon: <SportsGolfIcon fontSize="large" color="primary" />,
    title: "Advanced Trackman Technology",
    description:
      "Precision tracking of every aspect of your swing and ball flight.",
  },
  {
    icon: <GroupIcon fontSize="large" color="primary" />,
    title: "Group & Private Bookings",
    description: "Perfect for individuals, friends, and corporate events.",
  },
  {
    icon: <EventAvailableIcon fontSize="large" color="primary" />,
    title: "Flexible Scheduling",
    description: "Book hourly slots convenient for your schedule.",
  },
  {
    icon: <LocationOnIcon fontSize="large" color="primary" />,
    title: "Convenient Location",
    description:
      "Centrally located facility with ample parking and easy access.",
  },
];

const Features = () => {
  return (
    <Container sx={{ py: 10 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Why GWR-GLF?
      </Typography>
      <Grid container spacing={4} sx={{ mt: 4 }}>
        {simulatorFeatures.map((feature, index) => (
          <Grid size={{ xs: 12, md: 3 }} key={index}>
            <Box textAlign="center">
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  margin: "auto",
                  mb: 2,
                  bgcolor: "primary.light",
                }}
              >
                {feature.icon}
              </Avatar>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {feature.description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Features;
