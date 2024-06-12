import { Box, Button, Card, Divider, Grid, styled, useTheme } from "@mui/material";
import { useFormik } from "formik";
import DateRange from "icons/DateRange";
import FlexBox from "components/flexbox/FlexBox";
import Bratislava from "icons/Bratislava";
import MapMarkerIcon from "icons/MapMarkerIcon";
import FlexBetween from "components/flexbox/FlexBetween";
import IconButton from "@mui/material/IconButton";
import AvatarBadge from "components/avatars/AvatarBadge";
import { H4, H5, Tiny } from "components/Typography";
import AppTextField from "components/input-fields/AppTextField";
import LinearProgress from "@mui/material/LinearProgress";
import { CameraAlt } from "@mui/icons-material";
import * as Yup from "yup"; 
import AuthContext from "contexts/JWTAuth";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { LoadingButton } from "@mui/lab"; // Import LoadingButton

const ContentWrapper = styled(Box)(({ theme }) => ({
  zIndex: 1,
  marginTop: 55,
  position: "relative",
  [theme.breakpoints.down("sm")]: {
    paddingLeft: 20,
    paddingRight: 20
  }
}));

const CoverPicWrapper = styled(Box)(({ theme }) => ({
  top: 0,
  left: 0,
  height: 125,
  width: "100%",
  overflow: "hidden",
  position: "absolute",
  backgroundColor: theme.palette.background.default
}));

const ImageWrapper = styled(Box)(({ theme }) => ({
  width: 100,
  height: 100,
  margin: "auto",
  overflow: "hidden",
  borderRadius: "50%",
  border: "2px solid",
  borderColor: "white",
  paddingTop: "12px",
  backgroundColor: theme.palette.background.default
}));

const BasicInformation = () => {
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const [loading, setLoading] = useState(false); // State for loading button

  const initialValues = {
    id: user.id,
    firstName: user.name,
    email: user.email,
    phone: user.phone || '',
    organization: user.organization || '',
    department: user.department || '',
    country: user.country || 'Morocco',
    state: user.state || '',
    address: user.address || '',
    zipCode: user.zipcode || ''
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().min(3, "Must be greater than 3 characters").required("First Name is Required!"),
    email: Yup.string().email("Invalid email address").required("Email is Required!"),
    phone: Yup.string().min(9),
    organization: Yup.string(),
    department: Yup.string(),
    country: Yup.string(),
    state: Yup.string(),
    address: Yup.string(),
    zipCode: Yup.number()
  });

  const {
    values,
    errors,
    handleSubmit,
    handleChange,
    handleBlur,
    touched,
    resetForm // Formik resetForm function
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true); // Set loading state to true
        const accessToken = localStorage.getItem("accessToken");
        const response = await fetch('https://myserver.oulkaid-elhoussin.workers.dev/api/user/update', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': accessToken
          },
          body: JSON.stringify({
            id: values.id,
            name: values.firstName,
            email: values.email,
            phone: values.phone,
            organization: values.organization,
            department: values.department,
            country: values.country,
            state: values.state,
            address: values.address,
            zipcode: values.zipCode
          })
        });

        if (response.ok) {
          const result = await response.json();
          toast.success("Update successful", { duration: 4000 });
          window.location.reload(); // Refresh the page
        } else {
          toast.success("Update failed", { duration: 4000 });
        }
      } catch (error) {
        toast.success("Error updating user", { duration: 4000 });
      } finally {
        setLoading(false); // Set loading state to false
      }
    }
  });

  const handleCancel = () => {
    resetForm(); // Reset form values to initial values
  };

  return (
    <>
      <Card sx={{
        padding: 3,
        position: "relative"
      }}>
        <CoverPicWrapper>
          <img width="100%" height="100%" alt="Team Member" src="/static/background/user-cover-pic.png" style={{
            objectFit: "cover"
          }} />
        </CoverPicWrapper>

        <ContentWrapper>
          <FlexBox justifyContent="center">
            <AvatarBadge badgeContent={<label htmlFor="icon-button-file">
              <input type="file" accept="image/*" id="icon-button-file" style={{
                display: "none"
              }} />

              <IconButton aria-label="upload picture" component="span">
                <CameraAlt sx={{
                  fontSize: 16,
                  color: "text.disabled"
                }} />
              </IconButton>
            </label>}>
              <ImageWrapper>
                <img src="/static/avatar/001-man.svg" alt="Team Member" sizes="large" />
              </ImageWrapper>
            </AvatarBadge>
          </FlexBox>

          <Box mt={2}>
            <H4 fontWeight={600} textAlign="center">
              {user.name}
            </H4>

            <FlexBetween maxWidth={360} flexWrap="wrap" margin="auto" mt={1}>
              <FlexBox alignItems="center">
                <Bratislava sx={{
                  color: "text.disabled",
                  mr: 1,
                  fontSize: 18
                }} />
                <Tiny color="text.secondary">Doctor</Tiny>
              </FlexBox>

              <FlexBox alignItems="center">
                <MapMarkerIcon sx={{
                  color: "text.disabled",
                  mr: 1,
                  fontSize: 18
                }} />
                <Tiny color="text.secondary">Casablanca</Tiny>
              </FlexBox>

              <FlexBox alignItems="center">
                <DateRange sx={{
                  color: "text.disabled",
                  mr: 1,
                  fontSize: 18
                }} />
                <Tiny color="text.secondary">Joined March 17</Tiny>
              </FlexBox>
            </FlexBetween>

            <FlexBetween marginTop={6} flexWrap="wrap" justifyContent="space-between">
              <Box minWidth={200} sx={{
                [theme.breakpoints.down(600)]: {
                  minWidth: "100%",
                  mb: 2
                }
              }}>
                <Tiny mb={0.5}>Profile Completion</Tiny>

                <FlexBox alignItems="center">
                  <LinearProgress value={50} color="success" variant="determinate" sx={{
                    flexGrow: 1,
                    mr: 1
                  }} />
                  <Tiny fontWeight={600} color="text.primary">
                    50%
                  </Tiny>
                </FlexBox>
              </Box>

              {/* <FlexBox>
                <Button variant="outlined" sx={{
                  marginRight: 1
                }}>
                  Follow
                </Button>
                <Button variant="contained">Hire Me</Button>
              </FlexBox> */}
            </FlexBetween>
          </Box>
        </ContentWrapper>
      </Card>

      <Card sx={{
        mt: 3
      }}>
        <H5 padding={3}>Basic Information</H5>
        <Divider />

        <form onSubmit={handleSubmit}>
          <Box margin={3}>
            <Grid container spacing={3}>
              <Grid item sm={6} xs={12}>
                <AppTextField fullWidth name="firstName" label="First Name" variant="outlined" onBlur={handleBlur} onChange={handleChange} value={values.firstName} helperText={touched.firstName && errors.firstName} error={Boolean(touched.firstName && errors.firstName)} />
              </Grid>

              <Grid item sm={6} xs={12}>
                <AppTextField fullWidth name="email" label="Email" variant="outlined" onBlur={handleBlur} onChange={handleChange} value={values.email} helperText={touched.email && errors.email} error={Boolean(touched.email && errors.email)} />
              </Grid>

              <Grid item sm={6} xs={12}>
                <AppTextField fullWidth name="phone" label="Phone" variant="outlined" onBlur={handleBlur} onChange={handleChange} value={values.phone} helperText={touched.phone && errors.phone} error={Boolean(touched.phone && errors.phone)} />
              </Grid>

              <Grid item sm={6} xs={12}>
                <AppTextField fullWidth name="organization" variant="outlined" label="Organization" onBlur={handleBlur} onChange={handleChange} value={values.organization} helperText={touched.organization && errors.organization} error={Boolean(touched.organization && errors.organization)} />
              </Grid>

              <Grid item sm={6} xs={12}>
                <AppTextField fullWidth name="department" variant="outlined" label="Department" onBlur={handleBlur} onChange={handleChange} value={values.department} helperText={touched.department && errors.department} error={Boolean(touched.department && errors.department)} />
              </Grid>

              <Grid item sm={6} xs={12}>
                <AppTextField fullWidth name="country" label="Country" variant="outlined" onBlur={handleBlur} onChange={handleChange} value={values.country} helperText={touched.country && errors.country} error={Boolean(touched.country && errors.country)} />
              </Grid>

              <Grid item sm={6} xs={12}>
                <AppTextField fullWidth name="state" label="State" variant="outlined" onBlur={handleBlur} onChange={handleChange} value={values.state} helperText={touched.state && errors.state} error={Boolean(touched.state && errors.state)} />
              </Grid>

              <Grid item sm={6} xs={12}>
                <AppTextField fullWidth name="address" label="Address" variant="outlined" onBlur={handleBlur} onChange={handleChange} value={values.address} helperText={touched.address && errors.address} error={Boolean(touched.address && errors.address)} />
              </Grid>

              <Grid item sm={6} xs={12}>
                <AppTextField fullWidth type="number" name="zipCode" label="Zip Code" variant="outlined" onBlur={handleBlur} onChange={handleChange} value={values.zipCode} helperText={touched.zipCode && errors.zipCode} error={Boolean(touched.zipCode && errors.zipCode)} />
              </Grid>

              <Grid item xs={12}>
                <LoadingButton 
                  loading={loading} // Pass the loading state to the LoadingButton
                  type="submit"
                  variant="contained"
                >
                  Save Changes
                </LoadingButton>
                <Button variant="outlined" sx={{ ml: 2 }} onClick={handleCancel}> {/* Call handleCancel on button click */}
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Box>
        </form>
      </Card>
    </>
  );
};

export default BasicInformation;
