import React, { useState, useContext, useEffect } from "react";
import { PhotoCamera } from "@mui/icons-material";
import {
  alpha,
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  MenuItem,
  Select,
  styled,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AppTextField from "components/input-fields/AppTextField";
import AuthContext from "contexts/JWTAuth";
import { Small } from "components/Typography";

const ButtonWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  width: 100,
  height: 100,
  display: "flex",
  borderRadius: "50%",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor:
    theme.palette.mode === "light"
      ? theme.palette.secondary[200]
      : alpha(theme.palette.primary[100], 0.1),
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
  backgroundColor:
    theme.palette.mode === "light"
      ? theme.palette.secondary[400]
      : alpha(theme.palette.background.paper, 0.9),
}));

const TextBelowIcon = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: -25,
  left: "50%",
  transform: "translateX(-50%)",
  backgroundColor: alpha(theme.palette.common.black, 0.8),
  color: theme.palette.common.white,
  padding: "2px 8px",
  borderRadius: 4,
  zIndex: 1,
}));

const AddNewImage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const initialValues = {
    title: "",
    description: "",
    type: "",
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is Required!"),
    description: Yup.string().required("Description is Required!"),
    type: Yup.string().required("Type is Required!"),
  });

  const [image, setImage] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const [diseaseList, setDiseaseList] = useState([]);

  useEffect(() => {
    // Fetch disease list from server
    fetch('https://myserver.oulkaid-elhoussin.workers.dev/api/diseases-titles')
      .then(response => response.json())
      .then(data => setDiseaseList(data))
      .catch(error => console.error('Error fetching disease list:', error));
  }, []); // Empty dependency array means this effect runs only once, after initial render

  const handleImageUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
      setUploaded(true);
    }
  };

  const { values, errors, handleChange, handleSubmit, touched } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("file", image);
      const response = await fetch("https://myserver.oulkaid-elhoussin.workers.dev/api/images/get-image-url", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        const imageUrl = await response.json();

        // Send image data to second server
        const dataResponse = await fetch("https://myserver.oulkaid-elhoussin.workers.dev/api/images/upload", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: values.title,
            description: values.description,
            publisher: user.name,
            url: imageUrl,
            diseaseTitle: values.type,
          }),
        });
        if (!dataResponse.ok) {
          toast.error("Failed to send image data");
          return;
        }
    
      } else {
        toast.error("Failed to get image URL");
        return;
      }
      
      toast.success("The image uploaded successfully", { duration: 4000 });
      // resetForm();
      navigate("/dashboard/image-grid");

    },
  });

  return (
    <Box pt={2} pb={4}>
      <Card sx={{ padding: 4 }}>
        <Grid container spacing={3}>
          <Grid item md={4} xs={12}>
            <Card
              sx={{
                padding: 3,
                boxShadow: 2,
                minHeight: 400,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <ButtonWrapper>
                <UploadButton>
                  <label htmlFor="upload-btn">
                    <input
                      accept="image/*"
                      id="upload-btn"
                      type="file"
                      style={{ display: "none" }}
                      onChange={handleImageUpload}
                    />
                    <IconButton component="span">
                      <PhotoCamera sx={{ fontSize: 26, color: "white" }} />
                    </IconButton>
                  </label>
                </UploadButton>
                {!uploaded && (
                  <TextBelowIcon>Uploading Image...</TextBelowIcon>
                )}
              </ButtonWrapper>

              {uploaded && (
                <Box mt={2}>
                  <Small
                    marginTop={2}
                    maxWidth={200}
                    lineHeight={1.9}
                    display="block"
                    textAlign="center"
                    color="text.disabled"
                  >
                    Image Uploaded
                  </Small>
                  {image && (
                    <Box mt={1}>
                      <img
                        src={URL.createObjectURL(image)}
                        alt="Uploaded"
                        style={{ maxWidth: 200, maxHeight: 200 }}
                      />
                    </Box>
                  )}
                </Box>
              )}
            </Card>
          </Grid>
          <Grid item md={8} xs={12}>
            <Card sx={{ padding: 3, boxShadow: 2 }}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <AppTextField
                      fullWidth
                      name="title"
                      placeholder="Image Title"
                      value={values.title}
                      onChange={handleChange}
                      error={Boolean(touched.title && errors.title)}
                      helperText={touched.title && errors.title}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <AppTextField
                      multiline
                      fullWidth
                      rows={6}
                      name="description"
                      placeholder="Description"
                      value={values.description}
                      onChange={handleChange}
                      error={Boolean(
                        touched.description && errors.description
                      )}
                      helperText={touched.description && errors.description}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Select
                      fullWidth
                      name="type"
                      value={values.type}
                      onChange={handleChange}
                      displayEmpty
                      error={Boolean(touched.type && errors.type)}
                      inputProps={{ "aria-label": "type" }}
                    >
                      <MenuItem value="" disabled>
                        Select Type
                      </MenuItem>
                      {/* Use diseaseList fetched from the server */}
                      {diseaseList.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>

                  <Grid item xs={12}>
                    <Button type="submit" variant="contained">
                      Add Image
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Card>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default AddNewImage;
