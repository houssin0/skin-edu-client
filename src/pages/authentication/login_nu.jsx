import { Button, ButtonBase, Divider, Stack, styled,Grid } from "@mui/material";
import AppCheckBox from "components/AppCheckBox";
import FlexBetween from "components/flexbox/FlexBetween";
import FlexBox from "components/flexbox/FlexBox";
import AppTextField from "components/input-fields/AppTextField";
import { Small } from "components/Typography";
import AuthenticationLayout from "page-sections/authentication/AuthenticationLayout";
import React, { useState } from "react";
import axios from "axios";
import { rehashPassword } from './hashPassword';
import { useNavigate } from "react-router-dom";

const StyledButton = styled(ButtonBase)(({
  theme
}) => ({
  width: "100%",
  padding: 12,
  marginBottom: 16,
  borderRadius: "8px",
  fontWeight: "500",
  border: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down(454)]: {
    width: "100%",
    marginBottom: 8
  }
}));

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post("http://192.168.29.120:5000/api/v1/tkseller/seller/sellerlogin", { "email": email })
      .then(async (response) => {
        const passwordHash = response.data.data.passwordHash;
        const passwordSalt = response.data.data.passwordSalt;
        const rehashedPassword = await rehashPassword(password, passwordSalt);
        if (passwordHash === rehashedPassword) {
          console.log("Passwords match");
          navigate("/dashboard");
        } else {
          console.log("Passwords do not match");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return <AuthenticationLayout route="/register" description="New Here?" title="Seller Point" routeName="Create an account">
      <form>
        <Stack gap={2} mt={5}>
        <Grid item  xs={12}>
              <AppTextField fullWidth label="Email" variant="standard" value={email} onChange={handleEmailChange}/>
            </Grid>
            <Grid item  xs={12}>
              <AppTextField fullWidth label="Password" type="password" variant="standard" value={password}  onChange={handlePasswordChange}/>
            </Grid>
          {/* <AppTextField fullWidth label="Email" />
          <AppTextField fullWidth label="Password" /> */}
          <FlexBetween>
            <FlexBox alignItems="center" gap={1}>
              <AppCheckBox defaultChecked />
              <Small fontSize={12}>Remember me</Small>
            </FlexBox>

            <Button disableRipple sx={{
            color: "error.main",
            mb: 2
          }}>
              Forget Password
            </Button>
          </FlexBetween>

          <Button variant="contained" onClick={handleSubmit}>Sign In</Button>
        </Stack>
      </form>

      <Divider sx={{
      marginTop: 4
    }}>
        {/* <Small color="text.disabled" px={1}>
          OR
        </Small> */}
      </Divider>

      {/* <Stack direction="row" justifyContent="space-between" flexWrap="wrap" my={3}>
        <StyledButton>
          <GoogleIcon sx={{
          marginRight: 1,
          fontSize: "1.2rem"
        }} />
          Signin with Google
        </StyledButton>

        <StyledButton>
          <Facebook sx={{
          color: "#2475EF",
          marginRight: 1,
          fontSize: "1.2rem"
        }} />
          Signin with Facebook
        </StyledButton>

        <StyledButton>
          <Twitter sx={{
          color: "#45ABF7",
          marginRight: 1,
          fontSize: "1.2rem"
        }} />
          Signin with Twitter
        </StyledButton>
      </Stack> */}
    </AuthenticationLayout>;
};

export default Login;