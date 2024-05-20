import { LoadingButton } from "@mui/lab";
import { Box, Button, Card, FormControlLabel, FormHelperText, Switch } from "@mui/material";
import FlexBetween from "components/flexbox/FlexBetween";
import FlexRowAlign from "components/flexbox/FlexRowAlign";
import AppTextField from "components/input-fields/AppTextField";
import { H1, Paragraph, Small } from "components/Typography";
import { useFormik } from "formik";
import useAuth from "hooks/useAuth";
import { TextFieldWrapper } from "page-sections/authentication/StyledComponents";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";

const Login = () => {
  const {
    login
  } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();
  const initialValues = {
    email: "houssin@test.com",
    password: "houssin",
    submit: null,
    remember: true
  }; // form field value validation schema

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Must be a valid email").max(255).required("Email is required"),
    password: Yup.string().min(6, "Password should be of minimum 6 characters length").required("Password is required")
  });
  const {
    errors,
    values,
    touched,
    handleBlur,
    handleChange,
    handleSubmit
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: values => {
      setLoading(true);
      login(values.email, values.password).then(() => {
        setLoading(false);
        toast.success("You Logged In Successfully test");
        navigate("/dashboard");
      }).catch(error => {
        setError(error.message);
        setLoading(false);
      });
    }
  });
  return <FlexRowAlign flexDirection="column" sx={{
    height: {
      sm: "100%"
    }
  }}>
      <Card sx={{
      padding: 4,
      maxWidth: 600,
      boxShadow: 1
    }}>
        <FlexRowAlign flexDirection="column" mb={5}>
          <Box width={38} mb={1}>
            <img src="/static/logo/SkinEdu.png" width="100%" alt="Uko Logo" />
          </Box>
          <H1 fontSize={24} fontWeight={700}>
            Sign In to SkinEdu
          </H1>
        </FlexRowAlign>

        <FlexBetween flexWrap="wrap" my="1rem">
          

          <form noValidate onSubmit={handleSubmit} style={{
          width: "100%"
        }}>
            <FlexBetween flexWrap="wrap">
              <TextFieldWrapper>
                <AppTextField fullWidth name="email" type="email" label="Email" onBlur={handleBlur} onChange={handleChange} value={values.email || ""} error={Boolean(touched.email && errors.email)} helperText={touched.email && errors.email} sx={{
                mb: {
                  xs: 1
                }
              }} />
              </TextFieldWrapper>

              <TextFieldWrapper>
                <AppTextField fullWidth name="password" type="password" label="Password" onBlur={handleBlur} onChange={handleChange} value={values.password || ""} error={Boolean(touched.password && errors.password)} helperText={touched.password && errors.password} />
              </TextFieldWrapper>
            </FlexBetween>

            <FlexBetween mt={2}>
              <FormControlLabel control={<Switch name="remember" checked={values.remember} onChange={handleChange} />} label="Remember Me" sx={{
              "& .MuiTypography-root": {
                fontWeight: 500
              }
            }} />
              <Link to="/forget-password">
                <Small color="secondary.red">Forgot Password?</Small>
              </Link>
            </FlexBetween>

            {error && <FormHelperText error sx={{
            mt: 2,
            fontSize: 13,
            fontWeight: 500,
            textAlign: "center" 
          }}>
                {error}
              </FormHelperText>}

            <Box sx={{
            mt: 4
          }}>
              {loading ? <LoadingButton loading fullWidth variant="contained">
                  Sign In
                </LoadingButton> : <Button fullWidth type="submit" variant="contained">
                  Sign In
                </Button>}
            </Box>
          </form>

          <Paragraph marginLeft="auto" marginRight="auto" mt={2} color="text.disabled">
            Don't have an account?{" "}
            <Link to="/register" style={{
            display: "inline-block"
          }}>
              <Small color="primary.main">Create an account</Small>
            </Link>
          </Paragraph>
        </FlexBetween>
      </Card>
    </FlexRowAlign>;
};

export default Login;