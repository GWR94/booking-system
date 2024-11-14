import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import { GoogleIcon, FacebookIcon } from "../assets/icons/CustomIcons";
import { registrationSchema } from "../validation/schema";
import axios from "axios";
import LoadingButton from "@mui/lab/LoadingButton";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
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
type FormInput = "name" | "email" | "password" | "confirm";
interface FormData {
  name: {
    value: string;
    errorMsg: string;
  };
  email: {
    value: string;
    errorMsg: string;
  };
  password: {
    value: string;
    errorMsg: string;
  };
  confirm: {
    value: string;
    errorMsg: string;
  };
}

const RegisterUser = () => {
  const [formData, setFormData] = useState<FormData>({
    name: {
      value: "",
      errorMsg: "",
    },
    email: {
      value: "",
      errorMsg: "",
    },
    password: {
      value: "",
      errorMsg: "",
    },
    confirm: {
      value: "",
      errorMsg: "",
    },
  });
  const [allowMarketing, setMarketing] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const validateInputs = (type?: FormInput): boolean => {
    const validationData = {
      name: formData.name.value,
      email: formData.email.value,
      password: formData.password.value,
      confirm: formData.confirm.value,
    };

    // get validation errors from joi validation library
    const { error } = registrationSchema.validate(validationData, {
      abortEarly: false,
    });

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
        name: { ...prevData.name, errorMsg: "" },
        email: { ...prevData.email, errorMsg: "" },
        password: { ...prevData.password, errorMsg: "" },
        confirm: { ...prevData.confirm, errorMsg: "" },
      }));
      return true;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateInputs();
    if (!isValid) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_API}/api/user/register`,
        {
          name: formData.name.value,
          email: formData.email.value,
          password: formData.password.value,
        }
      );
      console.log(res);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Sign up
          </Typography>
          <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              autoComplete="name"
              label="Full Name"
              name="name"
              required
              variant="outlined"
              fullWidth
              id="name"
              placeholder="John Doe"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: {
                    ...formData.name,
                    value: e.target.value,
                  },
                })
              }
              onBlur={() => validateInputs("name")}
              error={!!formData.name.errorMsg}
              helperText={formData.name.errorMsg}
              color={!!formData.name.errorMsg ? "error" : "primary"}
            />
            <TextField
              required
              fullWidth
              id="email"
              placeholder="your@email.com"
              label="Email Address"
              variant="outlined"
              name="email"
              autoComplete="email"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: {
                    ...formData.email,
                    value: e.target.value,
                  },
                })
              }
              onBlur={() => validateInputs("email")}
              error={!!formData.email.errorMsg}
              helperText={formData.email.errorMsg}
              color={!!formData.email.errorMsg ? "error" : "primary"}
            />
            <TextField
              required
              fullWidth
              label="Password"
              name="password"
              placeholder="••••••••••••"
              type="password"
              id="password"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: {
                    ...formData.password,
                    value: e.target.value,
                  },
                })
              }
              onBlur={() => validateInputs("password")}
              autoComplete="new-password"
              variant="outlined"
              error={!!formData.password.errorMsg}
              helperText={formData.password.errorMsg}
              color={!!formData.password.errorMsg ? "error" : "primary"}
            />
            <TextField
              required
              fullWidth
              name="confirm-password"
              placeholder="••••••••••••"
              type="password"
              id="confirm-password"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  confirm: {
                    ...formData.confirm,
                    value: e.target.value,
                  },
                })
              }
              onBlur={() => validateInputs("confirm")}
              autoComplete="confirm-password"
              variant="outlined"
              label="Confirm Password"
              error={!!formData.confirm.errorMsg}
              helperText={formData.confirm.errorMsg}
              color={!!formData.confirm.errorMsg ? "error" : "primary"}
            />
            <FormControlLabel
              control={
                <Checkbox
                  value={allowMarketing}
                  onChange={(e) => setMarketing(e.currentTarget.checked)}
                  color="primary"
                />
              }
              label="I want to receive updates via email."
            />
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              loading={isLoading}
            >
              Sign up
            </LoadingButton>
            <Typography sx={{ textAlign: "center" }}>
              Already have an account?{" "}
              <span>
                <Link
                  href="/material-ui/getting-started/templates/sign-in/"
                  variant="body2"
                  sx={{ alignSelf: "center" }}
                >
                  Sign in
                </Link>
              </span>
            </Typography>
          </Box>
          <Divider>
            <Typography sx={{ color: "text.secondary" }}>or</Typography>
          </Divider>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert("Sign up with Google")}
              startIcon={<GoogleIcon />}
            >
              Sign up with Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert("Sign up with Facebook")}
              startIcon={<FacebookIcon />}
            >
              Sign up with Facebook
            </Button>
          </Box>
        </Card>
      </SignUpContainer>
    </>
  );
};

export default RegisterUser;
