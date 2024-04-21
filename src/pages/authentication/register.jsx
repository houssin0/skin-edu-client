import { LoadingButton } from "@mui/lab";
import { Box, Button, Card, MenuItem, FormControlLabel, Checkbox, FormHelperText } from "@mui/material";
import FlexBox from "components/flexbox/FlexBox";
import AppTextField from "components/input-fields/AppTextField";
import { H1, Small } from "components/Typography";
import { useFormik } from "formik";
import useAuth from "hooks/useAuth";
import { TextFieldWrapper } from "page-sections/authentication/StyledComponents";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";

const Register = () => {
  const {
    register
  } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const initialValues = {
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
    userType: "",
    terms: true,
    submit: null,
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Must be a valid email")
      .max(255)
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password should be of minimum 6 characters length")
      .required("Password is required"),
    repeatPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Repeat password is required"),
    userType: Yup.string().required("User type is required"),
    terms: Yup.boolean().oneOf([true], "You must accept the terms and conditions"),
  });

  const { errors, values, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema,
      onSubmit: async (values) => {
        setLoading(true);
        try {
          await register(values.username, values.email, values.password, values.userType);
          setLoading(false);
          toast.success("You registered successfully");
          navigate("/login");
        } catch (error) {
          setError(error?.message);
          setLoading(false);
        }
      },
    });

  return (
    <FlexBox
      sx={{
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        height: { sm: "100%" },
      }}
    >
      <Card sx={{ padding: 4, maxWidth: 600, boxShadow: 1 }}>
        <FlexBox
          alignItems="center"
          flexDirection="column"
          justifyContent="center"
          mb={5}
        >
          <Box width={38} mb={1}>
            <img src="/static/logo/SkinEdu.png" width="100%" alt="SkinEdu Logo" />
          </Box>
          <H1 fontSize={24} fontWeight={700}>
            Get started with SkinEdu
          </H1>
        </FlexBox>

        <FlexBox justifyContent="space-between" flexWrap="wrap" my="1rem">
          <form noValidate onSubmit={handleSubmit} style={{ width: "100%" }}>
            <FlexBox justifyContent="space-between" flexWrap="wrap">
              <TextFieldWrapper>
                <AppTextField
                  fullWidth
                  name="username"
                  type="text"
                  label="Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.username || ""}
                  error={Boolean(touched.username && errors.username)}
                  helperText={touched.username && errors.username}
                  margin="normal"
                />
              </TextFieldWrapper>

              <TextFieldWrapper>
                <AppTextField
                  fullWidth
                  name="email"
                  type="email"
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email || ""}
                  error={Boolean(touched.email && errors.email)}
                  helperText={touched.email && errors.email}
                  margin="normal"
                />
              </TextFieldWrapper>
            </FlexBox>

            <FlexBox justifyContent="space-between" flexWrap="wrap">
              <TextFieldWrapper>
                <AppTextField
                  fullWidth
                  name="password"
                  type="password"
                  label="Password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password || ""}
                  error={Boolean(touched.password && errors.password)}
                  helperText={touched.password && errors.password}
                  margin="normal"
                />
              </TextFieldWrapper>
                
              <TextFieldWrapper>
                <AppTextField
                  fullWidth
                  name="repeatPassword"
                  type="password"
                  label="Repeat Password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.repeatPassword || ""}
                  error={Boolean(touched.repeatPassword && errors.repeatPassword)}
                  helperText={touched.repeatPassword && errors.repeatPassword}
                  margin="normal"
                />
              </TextFieldWrapper>

              </FlexBox>

            <TextFieldWrapper sx={{ width: "100%" }}>
              <AppTextField
                fullWidth
                select
                name="userType"
                label="Select User Type"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.userType || ""}
                error={Boolean(touched.userType && errors.userType)}
                helperText={touched.userType && errors.userType}
                margin="normal"
                >
                <MenuItem value="med_student">Medicine Student</MenuItem>
                <MenuItem value="med_teacher">Medicine Teacher</MenuItem>
              </AppTextField>
            </TextFieldWrapper>

             <FormControlLabel
              control={
                <Checkbox
                  disableRipple
                  checked={values.terms}
                  onChange={handleChange}
                  name="terms"
                />
              }
              label="I agree to terms & conditions"
              sx={{
                marginTop: "0.5rem",
                marginLeft:"0rem",
                "& .MuiTypography-root": { fontWeight: 600 },
              }}
            />


            {error && (
              <FormHelperText
                error
                sx={{
                  mt: 2,
                  fontSize: 13,
                  fontWeight: 500,
                  textAlign: "center",
                }}
              >
                {error}
              </FormHelperText>
            )}

            <Box sx={{ mt: 4 }}>
              {loading ? (
                <LoadingButton loading fullWidth variant="contained">
                  Sign Up
                </LoadingButton>
              ) : (
                <Button fullWidth type="submit" variant="contained">
                  Sign Up
                </Button>
              )}
            </Box>
          </form>

          <Small margin="auto" mt={3} color="text.disabled">
            Do you already have an account?{" "}
            <Link to="/login">
              <Small color="primary.main">Log in</Small>
            </Link>
          </Small>
        </FlexBox>
      </Card>
    </FlexBox>
  );
};

export default Register;