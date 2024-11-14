import { useState } from "react";
import { styled } from "@mui/material/styles";
import ForgotPassword from "./ForgotPassword";
import { GoogleIcon, FacebookIcon } from "../assets/icons/CustomIcons";
import { loginSchema } from "../validation/schema";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Alert, LoadingButton } from "@mui/lab";
import {
  Stack,
  Snackbar,
  CssBaseline,
  Typography,
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  Divider,
  Button,
  Card as MuiCard,
} from "@mui/material";

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

type ValidationType = "password" | "email" | "confirmPassword";

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

type FormInput = "email" | "password";
interface FormData {
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

  const handleOAuthSignin = () => {};

  const handleLegacySignin = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateInputs();
    if (!isValid) return;
    const { email, password } = formData;
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/api/user/login`,
        {
          email: email.value,
          password: password.value,
        }
      );
      localStorage.setItem("jwtToken", data.token);
      setAlertOpen(true);
      navigate("/book");
    } catch (err) {
      setAlertError(true);
      setAlertOpen(true);
      setTimeout(() => {
        setAlertError(false);
      }, 2000);
      console.error(err);
    }
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // validateInputs();
  };

  const validateInputs = (type?: FormInput): boolean => {
    const validationData = {
      email: formData.email.value,
      password: formData.password.value,
    };

    // get validation errors from joi validation library
    const { error } = loginSchema.validate(validationData, {
      abortEarly: false,
    });

    console.log(error);

    if (error) {
      const updatedFormData: FormData = { ...formData };
      if (type) {
        // filter out others to return error which matches the input type
        const err = error.details?.filter(
          (detail) => detail.path[0] === type
        )[0];
        if (err) {
          setFormData({
            ...formData,
            [type]: {
              ...formData[type],
              errorMsg: err.message,
            },
          });
          return false;
        } else {
          setFormData({
            ...formData,
            [type]: {
              ...formData[type],
              errorMsg: "",
            },
          });
          return true;
        }
      }
      error.details.forEach((detail) => {
        // get key for incorrectly validated
        const key = detail.path[0] as keyof typeof formData;
        if (key in updatedFormData) {
          updatedFormData[key] = {
            ...updatedFormData[key],
            errorMsg: detail.message,
          };
        }
        setFormData(updatedFormData);
      });
      return false;
    } else {
      // clear all error messages if there are no validation errors.
      setFormData((prevData) => ({
        ...prevData,
        email: { ...prevData.email, errorMsg: "" },
        password: { ...prevData.password, errorMsg: "" },
      }));
      return true;
    }
  };

  return (
    <>
      <Snackbar
        open={alertOpen}
        autoHideDuration={2000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={alertError ? "error" : "success"}
          variant="outlined"
          sx={{ width: "100%" }}
        >
          {alertError
            ? "Unable to login. Please check email and password."
            : "Logged in successfully"}
        </Alert>
      </Snackbar>
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
              error={!!formData.email.errorMsg}
              helperText={formData.email.errorMsg}
              id="email"
              type="email"
              name="email"
              label="Email Address"
              value={formData.email.value}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: {
                    errorMsg: "",
                    value: e.target.value,
                  },
                })
              }
              onBlur={() => validateInputs("email")}
              placeholder="your@email.com"
              autoComplete="email"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={!!formData.email.errorMsg ? "error" : "primary"}
              sx={{ ariaLabel: "email" }}
            />
            <TextField
              error={!!formData.password.errorMsg}
              helperText={formData.password.errorMsg}
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              label="Password"
              value={formData.password.value}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: {
                    errorMsg: "",
                    value: e.target.value,
                  },
                })
              }
              onBlur={() => validateInputs("password")}
              autoComplete="current-password"
              required
              fullWidth
              variant="outlined"
              color={!!formData.password.errorMsg ? "error" : "primary"}
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
              onClick={() => alert("Sign in with Google")}
              startIcon={<GoogleIcon />}
            >
              Sign in with Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert("Sign in with Facebook")}
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
