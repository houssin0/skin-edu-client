import { PhotoCamera } from "@mui/icons-material";
import { Box, Button, Card, Grid, IconButton, styled, Switch, MenuItem } from "@mui/material";
import AppTextField from "components/input-fields/AppTextField";
import { Small, Tiny } from "components/Typography";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup"; // styled components
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const ButtonWrapper = styled(Box)(({ theme }) => ({
  width: 100,
  height: 100,
  display: "flex",
  borderRadius: "50%",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.action.disabledBackground
}));

const UploadButton = styled(Box)(({ theme }) => ({
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  border: "2px solid",
  alignItems: "center",
  justifyContent: "center",
  borderColor: theme.palette.background.paper,
  backgroundColor: theme.palette.action.disabledBackground
}));

const SwitchWrapper = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  marginTop: 10
}));

const AddNewUser = () => {
  const [isApproved, setIsApproved] = useState(false); // State to track switch value
  const [isLoading, setIsLoading] = useState(false); // State to track loading
  const navigate = useNavigate(); // Hook to navigate

  const initialValues = {
    name: "",
    email: "",
    password: "",
    phone: "",
    organization: "",
    department: "",
    country: "",
    state: "",
    city: "",
    address: "",
    userType: ""
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is Required!"),
    email: Yup.string().email().required("Email is Required!"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is Required!"),
    phone: Yup.number().min(8).required("Phone is Required!"),
    organization: Yup.string().required("Organization is Required!"),
    department: Yup.string().required("Department is Required!"),
    country: Yup.string().required("Country is Required!"),
    state: Yup.string().required("State is Required!"),
    city: Yup.string().required("City is Required!"),
    address: Yup.string().required("Address is Required!"),
    userType: Yup.string().required("User Type is Required!")
  });

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    touched,
    handleBlur
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async () => {
      setIsLoading(true); // Set loading state to true
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await fetch('https://myserver.oulkaid-elhoussin.workers.dev/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': accessToken
          },
          body: JSON.stringify({ ...values, is_approved: isApproved ? "1" : "0" })
        });

        // const data = await response.json();

        if (response.ok) {
          toast.success("User added Successfully!");
          navigate("/dashboard/user-list"); // Navigate to /user-list
        } else {
          toast.error("An error occurred while adding user!");
        }
      } catch (error) {
        toast.error("An error occurred");
      } finally {
        setIsLoading(false); // Set loading state to false
      }
    }
  });

  return (
    <Box pt={2} pb={4}>
      <Grid container spacing={3} justifyContent="center">
        <Grid item md={4} xs={12}>
          <Card sx={{ padding: 3, minHeight: 400, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <ButtonWrapper>
              <UploadButton>
                <label htmlFor="upload-btn">
                  <input accept="image/*" id="upload-btn" type="file" style={{ display: "none" }} />
                  <IconButton component="span">
                    <PhotoCamera sx={{ fontSize: 26, color: "white" }} />
                  </IconButton>
                </label>
              </UploadButton>
            </ButtonWrapper>

            <Small marginTop={2} maxWidth={200} lineHeight={1.9} display="block" textAlign="center" color="text.secondary">
              Allowed *.jpeg, *.jpg, *.png, *.gif max size of 3.1 MB
            </Small>

            <Box maxWidth={250} marginTop={5} marginBottom={1}>
              <SwitchWrapper>
                <Small display="block" fontWeight={600}>
                  Verified
                </Small>
                <Switch
                  checked={isApproved}
                  onChange={(e) => setIsApproved(e.target.checked)}
                />
              </SwitchWrapper>
              <Tiny display="block" color="text.secondary" fontWeight={500}>
                Disabling this will automatically send the user a verification email
              </Tiny>
            </Box>
          </Card>
        </Grid>

        <Grid item md={8} xs={12}>
          <Card sx={{ padding: 3 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item sm={6} xs={12}>
                  <AppTextField
                    fullWidth
                    name="name"
                    label="Full Name"
                    value={values.name}
                    onChange={handleChange}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                  />
                </Grid>

                <Grid item sm={6} xs={12}>
                  <AppTextField
                    fullWidth
                    name="email"
                    label="Email Address"
                    value={values.email}
                    onChange={handleChange}
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                  />
                </Grid>

                <Grid item sm={6} xs={12}>
                  <AppTextField
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                    error={Boolean(touched.password && errors.password)}
                    helperText={touched.password && errors.password}
                  />
                </Grid>

                <Grid item sm={6} xs={12}>
                  <AppTextField
                    fullWidth
                    name="phone"
                    label="Phone Number"
                    value={values.phone}
                    onChange={handleChange}
                    error={Boolean(touched.phone && errors.phone)}
                    helperText={touched.phone && errors.phone}
                  />
                </Grid>

                <Grid item sm={6} xs={12}>
                  <AppTextField
                    fullWidth
                    name="organization"
                    label="Organization"
                    value={values.organization}
                    onChange={handleChange}
                    error={Boolean(touched.organization && errors.organization)}
                    helperText={touched.organization && errors.organization}
                  />
                </Grid>

                <Grid item sm={6} xs={12}>
                  <AppTextField
                    fullWidth
                    name="department"
                    label="Department"
                    value={values.department}
                    onChange={handleChange}
                    error={Boolean(touched.department && errors.department)}
                    helperText={touched.department && errors.department}
                  />
                </Grid>
                
                <Grid item sm={6} xs={12}>
                  <AppTextField
                    fullWidth
                    name="country"
                    label="Country"
                    value={values.country}
                    onChange={handleChange}
                    error={Boolean(touched.country && errors.country)}
                    helperText={touched.country && errors.country}
                  />
                </Grid>

                <Grid item sm={6} xs={12}>
                  <AppTextField
                    fullWidth
                    name="state"
                    label="State/Region"
                    value={values.state}
                    onChange={handleChange}
                    error={Boolean(touched.state && errors.state)}
                    helperText={touched.state && errors.state}
                  />
                </Grid>

                <Grid item sm={6} xs={12}>
                  <AppTextField
                    fullWidth
                    name="city"
                    label="City"
                    value={values.city}
                    onChange={handleChange}
                    error={Boolean(touched.city && errors.city)}
                    helperText={touched.city && errors.city}
                  />
                </Grid>

                <Grid item sm={6} xs={12}>
                  <AppTextField
                    fullWidth
                    name="address"
                    label="Address"
                    value={values.address}
                    onChange={handleChange}
                    error={Boolean(touched.address && errors.address)}
                    helperText={touched.address && errors.address}
                  />
                </Grid>
               
                <Grid item xs={12}>
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
                </Grid>

                <Grid item xs={12}>
                  <Button type="submit" variant="contained" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create User"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddNewUser;
