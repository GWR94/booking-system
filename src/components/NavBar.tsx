import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import GolfCourse from "@mui/icons-material/GolfCourse";
import { useNavigate } from "react-router-dom";

const settings = [];

interface NavBarProps {
  handleSignOut: () => void;
}

const NavBar = ({ handleSignOut }: NavBarProps) => {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

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

  return (
    <AppBar position="static">
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
                  handleCloseNavMenu();
                  navigate("/about");
                }}
              >
                <Typography sx={{ textAlign: "center" }}>About Us</Typography>
              </MenuItem>
              <MenuItem
                key="Book"
                onClick={() => {
                  handleCloseNavMenu();
                  navigate("/book");
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
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Home
            </Button>
            <Button
              key="About Us"
              onClick={() => {
                handleCloseNavMenu();
                navigate("/about");
              }}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              About Us
            </Button>
            <Button
              key="Book"
              onClick={() => {
                handleCloseNavMenu();
                navigate("/book");
              }}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Book
            </Button>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
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
              <MenuItem
                key="Account"
                onClick={() => {
                  handleCloseUserMenu();
                  navigate(`/account`);
                }}
              >
                <Typography sx={{ textAlign: "center" }}>Account</Typography>
              </MenuItem>
              <MenuItem
                key="Bookings"
                onClick={() => {
                  handleCloseUserMenu();
                  navigate(`/account/bookings`);
                }}
              >
                <Typography sx={{ textAlign: "center" }}>Bookings</Typography>
              </MenuItem>
              <MenuItem
                key="Logout"
                onClick={() => {
                  handleSignOut();
                  handleCloseUserMenu();
                }}
              >
                <Typography sx={{ textAlign: "center" }}>Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default NavBar;
