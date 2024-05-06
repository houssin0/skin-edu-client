import { Box, Button, Card, Grid, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import * as Yup from "yup";

const AddNewDisease = () => {
  const navigate = useNavigate();

  const initialValues = {
    title: "",
    description: "",
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is Required!"),
    description: Yup.string().required("Description is Required!"),
  });

  const { values, errors, handleChange, handleSubmit, touched } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      console.log("Form Values:", values); // Log form values
      // Here you can dispatch an action to add the new disease to your database or state
      try {
        const response = await fetch("https://myserver.oulkaid-elhoussin.workers.dev/api/diseases/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
        if (response.ok) {
          toast.success("New disease added successfully", { duration: 4000 });
          navigate("/dashboard/disease-grid"); // Redirect to disease list page after adding
        } else {
          toast.error("Failed to add new disease");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("An error occurred while adding the new disease");
      }
    },
  });

  
  return (
    <Box pt={2} pb={4}>
      <Card sx={{ padding: 4 }}>
        <Typography variant="h5" gutterBottom>Add New Disease</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="title"
                label="Disease Title"
                value={values.title}
                onChange={handleChange}
                error={Boolean(touched.title && errors.title)}
                helperText={touched.title && errors.title}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="description"
                label="Description"
                value={values.description}
                onChange={handleChange}
                error={Boolean(touched.description && errors.description)}
                helperText={touched.description && errors.description}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained">Add Disease</Button>
            </Grid>
          </Grid>
        </form>
      </Card>
    </Box>
  );
};

export default AddNewDisease;
