import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import ForgotPassword from "./ForgotPassword";
import { GoogleIcon, FacebookIcon } from "../../assets/icons/CustomIcons";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import {
  Stack,
  CssBaseline,
  Typography,
  Box,
  Link,
  TextField,
  FormControlLabel,
  Checkbox,
  Divider,
  Button,
  Card as MuiCard,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import validateInputs from "../../utils/validateInput";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

export interface FormData {
  email: {
    value: string;
    errorMsg: string;
  };
  password: {
    value: string;
    errorMsg: string;
  };
}

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: {
      value: "",
      errorMsg: "",
    },
    password: {
      value: "",
      errorMsg: "",
    },
  });

  const [open, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertError, setAlertError] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLegacySignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const isValid = validateInputs(formData, setFormData);
    if (!isValid) return;
    const { email, password } = formData;
    try {
      const success = await login({
        email: email.value,
        password: password.value,
      });
      if (success) {
        setTimeout(() => {
          navigate("/book");
        }, 1500);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const { email, password } = formData;

  const shouldDisable =
    !email.value.length ||
    !password.value.length ||
    email.errorMsg.length > 0 ||
    password.errorMsg.length > 0;

  return (
    <>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Sign in
          </Typography>
          <Box
            component="form"
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 2,
            }}
          >
            <TextField
              error={!!email.errorMsg}
              helperText={email.errorMsg}
              id="email"
              type="email"
              name="email"
              label="Email Address"
              value={email.value}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: {
                    errorMsg: "",
                    value: e.target.value,
                  },
                })
              }
              onBlur={() => validateInputs(formData, setFormData, "email")}
              placeholder="your@email.com"
              autoComplete="email"
              required
              fullWidth
              variant="outlined"
              color={!!email.errorMsg ? "error" : "primary"}
              sx={{ ariaLabel: "email" }}
            />
            <TextField
              error={!!password.errorMsg}
              helperText={password.errorMsg}
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              label="Password"
              value={password.value}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: {
                    errorMsg: "",
                    value: e.target.value,
                  },
                })
              }
              onBlur={() => validateInputs(formData, setFormData, "password")}
              autoComplete="current-password"
              required
              fullWidth
              variant="outlined"
              color={!!password.errorMsg ? "error" : "primary"}
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Link
                component="button"
                type="button"
                onClick={handleClickOpen}
                variant="body2"
                sx={{ alignSelf: "baseline" }}
              >
                Forgot your password?
              </Link>
            </Box>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <ForgotPassword open={open} handleClose={handleClose} />
            <LoadingButton
              type="submit"
              fullWidth
              loading={isLoading}
              variant="contained"
              disabled={shouldDisable}
              color={alertError ? "error" : "primary"}
              onClick={(e) => handleLegacySignin(e)}
            >
              {alertError ? "Error!" : "Sign in"}
            </LoadingButton>
            <Typography sx={{ textAlign: "center" }}>
              Don&apos;t have an account?{" "}
              <span>
                <Link
                  href="/register"
                  variant="body2"
                  sx={{ alignSelf: "center" }}
                >
                  Sign up
                </Link>
              </span>
            </Typography>
          </Box>
          <Divider>or</Divider>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              href={`${process.env.REACT_APP_BACKEND_API}/api/user/login/google`}
              // onClick={() => handleOAuthSignin("google")}
              startIcon={<GoogleIcon />}
            >
              Sign in with Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              href={`${process.env.REACT_APP_BACKEND_API}/api/user/login/facebook}`}
              startIcon={<FacebookIcon />}
            >
              Sign in with Facebook
            </Button>
          </Box>
        </Card>
      </SignInContainer>
    </>
  );
};

export default Login;

