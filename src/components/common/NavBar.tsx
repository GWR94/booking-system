import * as React from "react";
import { useNavigate } from "react-router-dom";
import { GolfCourse, Menu as MenuIcon } from "@mui/icons-material";
import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Box,
  Menu,
  IconButton,
  MenuItem,
  Button,
  Tooltip,
  Avatar,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { useMotionValueEvent, useScroll, motion } from "framer-motion";

const NavBar = ({ threshold = 150 }) => {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState<boolean>(false);
  const [lastScrollY, setLastScrollY] = useState<number>(0);

  useMotionValueEvent(scrollY, "change", (latest: number) => {
    // Determine scroll direction
    if (latest > lastScrollY && latest > threshold) {
      // Scrolling down and past threshold
      setHidden(true);
    } else if (latest < lastScrollY) {
      // Scrolling up
      setHidden(false);
    }

    // Update last scroll position
    setLastScrollY(latest);
  });

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const signOut = async () => {
    try {
      logout();
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ height: 68 }}>
      <motion.div
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
      >
        <AppBar position="relative">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <GolfCourse sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="#app-bar-with-responsive-menu"
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                GWR-GLF
              </Typography>

              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{ display: { xs: "block", md: "none" } }}
                >
                  <MenuItem key="Home" onClick={handleCloseNavMenu}>
                    <Typography sx={{ textAlign: "center" }}>Home</Typography>
                  </MenuItem>
                  <MenuItem
                    key="About Us"
                    onClick={() => {
                      navigate("/about");
                      handleCloseNavMenu();
                    }}
                  >
                    <Typography sx={{ textAlign: "center" }}>
                      About Us
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    key="Book"
                    onClick={() => {
                      navigate("/book");
                      handleCloseNavMenu();
                    }}
                  >
                    <Typography sx={{ textAlign: "center" }}>Book</Typography>
                  </MenuItem>
                </Menu>
              </Box>
              <GolfCourse sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
              <Typography
                variant="h5"
                noWrap
                component="a"
                href="#app-bar-with-responsive-menu"
                sx={{
                  mr: 2,
                  display: { xs: "flex", md: "none" },
                  flexGrow: 1,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                GWR-GLF
              </Typography>
              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                <Button
                  key="Home"
                  onClick={() => navigate("/")}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  Home
                </Button>
                <Button
                  key="About Us"
                  onClick={() => navigate("/about")}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  About Us
                </Button>
                <Button
                  key="Book"
                  onClick={() => navigate("/book")}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  Book
                </Button>
              </Box>
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt="Remy Sharp"
                      src="/static/images/avatar/2.jpg"
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem key="Account" onClick={() => navigate(`/account`)}>
                    <Typography sx={{ textAlign: "center" }}>
                      Account
                    </Typography>
                  </MenuItem>
                  <MenuItem
                    key="Bookings"
                    onClick={() => {
                      handleCloseUserMenu();
                      navigate(`/account/bookings`);
                    }}
                  >
                    <Typography sx={{ textAlign: "center" }}>
                      Bookings
                    </Typography>
                  </MenuItem>
                  {isAuthenticated ? (
                    <MenuItem key="Logout" onClick={() => signOut()}>
                      <Typography sx={{ textAlign: "center" }}>
                        Logout
                      </Typography>
                    </MenuItem>
                  ) : (
                    <MenuItem key="Logout" onClick={() => navigate("/login")}>
                      <Typography sx={{ textAlign: "center" }}>
                        Login
                      </Typography>
                    </MenuItem>
                  )}
                </Menu>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </motion.div>
    </div>
  );
};
export default NavBar;
