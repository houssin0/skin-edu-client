import React, { useState } from "react";
import { Box, Button, Stack, Alert } from "@mui/material";
import AppCheckBox from "components/AppCheckBox";
import RootLayout from "page-sections/authentication/RootLayout";
import FlexBox from "components/flexbox/FlexBox";
import FlexRowAlign from "components/flexbox/FlexRowAlign";
import { H1, Paragraph, Small } from "components/Typography";
import AppTextField from "components/input-fields/AppTextField";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { hashPassword } from './hashPassword';
import axios from "axios";


const NewPassword = (props) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  const { state } = useLocation();

  const navigate = useNavigate();


  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(state.sellerId);
    const { hash, salt } = await hashPassword(password);
    // console.log(state.sellerId);
    // console.log(hash);
    // console.log(salt);
    // Code to handle submit action goes here
    axios.post('http://192.168.29.120:5000/api/v1/tkseller/seller/sellersetpwd',
      {
        "sellerId": state.sellerId,
        "passwordSalt": salt, 
        "passwordHash": hash, 
        "loginAttempt": 0
      }
    ).then((response) => {
      if (response.status === 200) {
        navigate("/dashboard");
      }
    })
  };

  const [message, setMessage] = useState(null);

  const validatePassword = (password) => {
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,14}$/;
    return passwordPattern.test(password);
  };

  return (
    <RootLayout imgLink="/static/illustration/new-password.svg">
      <FlexRowAlign height="100%">
        <Box textAlign="center" maxWidth={550} width="100%" padding={4}>
          <img src="/static/logo/kartlogo.png" width={80} alt="Logo" />
          <H1 fontWeight={700} mt={2}>
            Setup New Password
          </H1>
          <Paragraph color="text.disabled" fontWeight={500}>
            Already have reset you password?{" "}
            <Link to="/login">Sign In</Link>
          </Paragraph>

          <form onSubmit={handleSubmit}>
            <Stack gap={3} mt={5}>
              <AppTextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                autoComplete="off"
                onChange={event => {
                  const password_1 = event.target.value;
                  setPassword(password_1);
                  if (!validatePassword(event.target.value)) {
                    setMessage(<Alert severity="info">The password should contain atleast one number and one special character, should have atleast one upper case and lower case, and have a length of 8 to 14 characters!</Alert>);
                  } else {
                    setMessage(null);
                  }
                }}
              />
              <AppTextField
                fullWidth
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                autoComplete="off"
                onChange={event => {
                  const confirmPassword_1 = event.target.value;
                  setConfirmPassword(confirmPassword_1);
                  if (password !== event.target.value) {
                    setMessage(<Alert severity="error">Please make sure your passwords match!</Alert>);
                  } else {
                    setMessage(null);
                  }
                }}
              />
              {message}
              <FlexBox alignItems="center" gap={1}>
                <AppCheckBox
                  defaultChecked={agreed}
                  onChange={(event) => {
                    const agreed_0 = event.target.checked;
                    setAgreed(agreed_0)
                  }
                  }
                />
                <Small fontSize={12}>
                  I agree to the{" "}
                  <Link to="#">terms and conditions</Link>
                </Small>
              </FlexBox>

              <Button
                variant="contained"
                fullWidth
                type="submit"
                disabled={
                  password !== confirmPassword || !agreed || !validatePassword(password)
                }
                onClick={handleSubmit}
              >
                Submit
              </Button>

            </Stack>
          </form>
        </Box>
      </FlexRowAlign>
    </RootLayout>
  );
};

export default NewPassword;
