import { Button, Grid, ButtonBase, Divider, Stack, styled, TextField, Radio, RadioGroup, FormControl, FormControlLabel, Alert, Checkbox, Box } from "@mui/material";
import AuthenticationLayout from "page-sections/authentication/AuthenticationLayout";
import { Small } from "components/Typography";
import AppTextField from "components/input-fields/AppTextField";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import validator from 'validator';
import { useNavigate } from "react-router-dom";

const StyledButton = styled(ButtonBase)(({
  theme
}) => ({
  width: "100%",
  padding: 12,
  marginBottom: 16,
  borderRadius: "6px",
  fontWeight: "500",
  color: "white",
  backgroundColor: '#8D1F1F',
  [theme.breakpoints.down(454)]: {
    width: "100%",
    marginBottom: 8
  }
}));


const Register = () => {

  const navigate = useNavigate();

  const uniqueNumber = Math.floor(Math.random() * 10000000);

  function handleChange(e) {

    console.log(`${parseInt(uniqueNumber)}, ${email}, ${name}, ${whatsappNumber}, ${businessName}, ${productSelling}, ${location}, ${isAmirtha}`);
    axios.post('http://192.168.29.120:5000/api/v1/tkseller/seller/sellerregister',
      {
        "sellergeneral": {
          "sellerUId": parseInt(uniqueNumber),
          "email": email,
          "firstName": name,
          "whatsupno": whatsappNumber,
          "isAmirtha": isAmirtha
        },

        "sellerBusiness": {
          "businessname": businessName,
          "productname": productSelling,
          "productType": parseInt(location)
        }
      }
    )
      .then(function (response) {
        console.log(response.data);
        console.log(response.status);
        console.log(response.data.message);
        console.log(response.data.data.sellerId);
        if (response.status === 200) {
          setAlertMessage(<Alert variant="filled" severity="success">{response.data.message}</Alert>);
          setTimeout(() => {
            const sellerId = response.data.data.sellerId;
            console.log(sellerId)
            navigate('/new-password', { state: { sellerId: sellerId } });
          }, 2000)
        } else if (response.status === 201) {
          setAlertMessage(<Alert variant="filled" severity="error">{response.data.message}</Alert>);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    e.preventDefault();
  }


  function forName(e) {
    setName(e.target.value);
  };
  function forEmail(e) {
    setEmail(e.target.value);

    ((e) => {
      if (validator.isEmail(email)) {
        setMessage("");
      } else {
        setMessage(<Alert severity="error">Please enter a valid email!</Alert>);
      }
    })();

    if (whatsappNumber.length > 8 && validator.isEmail(email)) {
      setDisabled(false);
    }
    else {
      setDisabled(true);
    }
  };
  function forWhatsappNumber(e) {
    setWhatsappNumber(e.target.value);
    if (whatsappNumber.length > 8 && validator.isEmail(email)) {
      setDisabled(false);
    }
    else {
      setDisabled(true);
    }
  };
  function forBusinessName(e) {
    setBusinessName(e.target.value);
  };
  function forProductSelling(e) {
    setProductSelling(e.target.value);
  };
  const locationChange = (event) => {
    setLocation(event.target.value);
  };
  const programClick = () => {
    window.open('http://localhost:3000/new-password', '_blank');
  };

  



  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [productSelling, setProductSelling] = useState("");
  const [location, setLocation] = useState("1");
  const [disabled, setDisabled] = useState(true);
  const [message, setMessage] = useState("");
  const [alertMessage, setAlertMessage] = useState();
  const [isAmirtha, setIsAmirtha] = useState(false);



  return <AuthenticationLayout route="/login" routeName="Login" title="Start Selling" description="Have an account?">
    {alertMessage}
    <form onSubmit={handleChange}>
      <Stack gap={2} mt={5}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <AppTextField fullWidth label="Name" variant="standard" onChange={forName} value={name} />
          </Grid>

          <Grid item xs={12}>
            <AppTextField required fullWidth label="Email" variant="standard" onChange={forEmail} value={email} autoComplete="off" />
            <br />
            <span
              style={{
                fontWeight: "bold",
                color: "red"
              }}
            >
              {message}
            </span>
          </Grid>

          <Grid item xs={12}>
            <AppTextField required fullWidth label="Whatsapp No" variant="standard" onChange={forWhatsappNumber} value={whatsappNumber} autoComplete="off" />
          </Grid>

          <Grid item xs={12} align="left">
            <Checkbox checked={isAmirtha} onChange={event => setIsAmirtha(event.target.checked)}/>
            <label>Are you a woman entrepreneur?</label>
          </Grid>

          {isAmirtha &&
            <Box m={2} mb={-2}>
              <Button variant="contained" onClick={ programClick }>Enroll To Amirtha Women Entrepreneurship Development Program</Button>
            </Box>
          }


          <Grid item xs={12}>
            <AppTextField fullWidth label="Business Name" variant="standard" onChange={forBusinessName} value={businessName} />
          </Grid>
          <Grid item xs={12}>
            <AppTextField fullWidth label="Product Selling" variant="standard" onChange={forProductSelling} value={productSelling} />
          </Grid>

          <Grid item xs={12} align="left">
            <FormControl component="fieldset">
              <RadioGroup name="location" value={location} onChange={locationChange}>
                <FormControlLabel value="1" control={<Radio />} label="Is Your Product Made in India" />
                <div style={{ textAlign: "center" }}>
                  <p>(Or)</p>
                </div>
                <FormControlLabel value="2" control={<Radio />} label="Is Your Product Imported From Other Countries" />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <StyledButton onClick={handleChange} disabled={disabled} style={{ filter: disabled ? "blur(1px) opacity(0.5)" : "" }}>
              SignUp
            </StyledButton>

            <Small fontSize={12} color="text.disabled" mt={2}>
              By signing up, I agree to UI Lib{" "}
              <NavLink to="#" style={{
                fontWeight: 600
              }}>
                Terms of Service & Privacy Policy
              </NavLink>
            </Small>
          </Grid>
        </Grid>
      </Stack>
    </form>
  </AuthenticationLayout>;
};

export default Register;