import { Box, Button, Card, Divider, Grid, Stack, styled } from "@mui/material";
import FlexBox from "components/flexbox/FlexBox";
import { H5, H6, Small, Tiny } from "components/Typography";
import AppTextField from "components/input-fields/AppTextField";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useContext, useState } from 'react';
import { LoadingButton } from "@mui/lab";
import toast from 'react-hot-toast';
import useAuth from 'hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import AuthContext from "contexts/JWTAuth";

const Dot = styled(Box)(({ theme }) => ({
  width: 8,
  height: 8,
  flexShrink: 0,
  borderRadius: "50%",
  backgroundColor: theme.palette.text.secondary
})); 

const Password = () => {
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth(); // Use the useAuth hook to get the logout function
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);


  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: ""
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().min(6, "Must be greater than 3 characters").required("Current Password is Required!"),
      newPassword: Yup.string().min(6).required("New Password is Required!"),
      confirmNewPassword: Yup.string().oneOf([Yup.ref("newPassword"), null], "Password doesn't match")
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await fetch('https://myserver.oulkaid-elhoussin.workers.dev/api/user/update-password', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': accessToken
          },
          body: JSON.stringify({
            id: user.id,
            oldPassword: values.currentPassword,
            newPassword: values.newPassword
          })
        });
    
        if (response.ok) {
          toast.success("Password updated successfully");
          // Logout the user after successful password update
          logout();
          // Redirect to the login page
          navigate('/login');
        } else {
          const data = await response.json(); // Get the error message from the server
          toast.error(data.message || "Failed to update password");
        }
      } catch (error) {
        console.error("Error updating password:", error);
        toast.error("Error updating password");
      }
      setLoading(false);
    }
  });

  const handleCancel = () => {
    formik.resetForm();
  };

  return (
    <Card>
      <H5 padding={3}>Password</H5>
      <Divider />

      <Box padding={3}>
        <Grid container spacing={5}>
          <Grid item sm={6} xs={12}>
            <form onSubmit={formik.handleSubmit}>
              <Stack spacing={4}>
                <AppTextField
                  fullWidth
                  type="password"
                  variant="outlined"
                  name="currentPassword"
                  label="Current Password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.currentPassword}
                  helperText={formik.touched.currentPassword && formik.errors.currentPassword}
                  error={Boolean(formik.touched.currentPassword && formik.errors.currentPassword)}
                />

                <AppTextField
                  fullWidth
                  type="password"
                  name="newPassword"
                  variant="outlined"
                  label="New Password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.newPassword}
                  helperText={formik.touched.newPassword && formik.errors.newPassword}
                  error={Boolean(formik.touched.newPassword && formik.errors.newPassword)}
                />
                <AppTextField
                  fullWidth
                  type="password"
                  variant="outlined"
                  name="confirmNewPassword"
                  label="Confirm Password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.confirmNewPassword}
                  helperText={formik.touched.confirmNewPassword && formik.errors.confirmNewPassword}
                  error={Boolean(formik.touched.confirmNewPassword && formik.errors.confirmNewPassword)}
                />
              </Stack>

              <Stack direction="row" spacing={3} mt={4}>
                <LoadingButton type="submit" variant="contained" loading={loading}>
                  Save Changes
                </LoadingButton>
                <Button variant="outlined" onClick={handleCancel}>
                  Cancel
                </Button>
              </Stack>
            </form>
          </Grid>

          <Grid item sm={6} xs={12}>
            <H6>Password requirements:</H6>
            <Tiny lineHeight={1.7}>
              Ensure that these requirements are met:
            </Tiny>

            <Stack spacing={1} mt={2}>
              <FlexBox alignItems="center">
                <Dot mr={1} />
                <Small fontSize={12} color="text.secondary">
                  Minimum 8 characters long - the more, the better
                </Small>
              </FlexBox>

              <FlexBox alignItems="center">
                <Dot mr={1} />
                <Small fontSize={12} color="text.secondary">
                  At least one lowercase character
                </Small>
              </FlexBox>

              <FlexBox alignItems="center">
                <Dot mr={1} />
                <Small fontSize={12} color="text.secondary">
                  At least one uppercase character
                </Small>
              </FlexBox>

              <FlexBox alignItems="center">
                <Dot mr={1} />
                <Small fontSize={12} color="text.secondary">
                  At least one number, symbol, or whitespace character
                </Small>
              </FlexBox>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};

export default Password;
