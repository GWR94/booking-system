import { Star } from "@mui/icons-material";
import {
  Box,
  Container,
  Typography,
  Grid2 as Grid,
  Card,
  CardContent,
  Avatar,
  Rating,
} from "@mui/material";

const testimonials = [
  {
    name: "John D.",
    quote:
      "Incredible simulator experience. Feels just like being on a real course!",
    avatar: "/path/to/avatar1.jpg",
    stars: 5,
  },
  {
    name: "Sarah M.",
    quote: "Great for improving my game. The data tracking is phenomenal.",
    avatar: "/path/to/avatar2.jpg",
    stars: 5,
  },
  {
    name: "Mike R.",
    quote: "Perfect spot for golf practice, especially during bad weather.",
    avatar: "/path/to/avatar3.jpg",
    stars: 5,
  },
];

const Testimonials = () => {
  return (
    <Box sx={{ bgcolor: "grey.100", py: 10 }}>
      <Container>
        <Typography variant="h4" align="center" gutterBottom>
          What Our Golfers Say
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {testimonials.map((testimonial, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <Card>
                <CardContent>
                  <Avatar
                    src={testimonial.avatar}
                    sx={{ width: 80, height: 80, margin: "auto", mb: 2 }}
                  />
                  <Typography
                    variant="body1"
                    align="center"
                    color="text.secondary"
                    sx={{ fontStyle: "italic", mb: 2 }}
                  >
                    "{testimonial.quote}"
                  </Typography>
                  <Typography variant="subtitle1" align="center">
                    {testimonial.name}
                  </Typography>
                  <Rating
                    value={testimonial.stars}
                    readOnly
                    sx={{ justifyContent: "center", width: "100%" }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Testimonials;
