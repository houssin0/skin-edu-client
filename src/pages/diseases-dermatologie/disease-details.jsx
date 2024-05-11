import { Box, Button, Typography, Grid, Divider } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import ImageCard from "../images-dermatologie/image-card";

const DiseaseDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const disease = location.state?.disease;
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [filteredImages, setFilteredImages] = useState([]);

  useEffect(() => {
    const fetchDiseaseData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        console.log(accessToken)
        const response = await fetch('https://myserver.oulkaid-elhoussin.workers.dev/api/diseases',{
          headers: {
            'Authorization': accessToken // Include the accessToken in the Authorization header
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch disease details');
        }
        const data = await response.json();
        const selected = data.find(item => item.title === disease.title);
        setSelectedDisease(selected);
      } catch (error) {
        console.error('Error fetching disease details:', error);
      }
    };

    const fetchImageData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        const response = await fetch('https://myserver.oulkaid-elhoussin.workers.dev/api/images',{
          headers: {
            'Authorization': accessToken // Include the accessToken in the Authorization header
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch images');
        }
        const data = await response.json();
        const filtered = data.filter(image => image.diseaseTitle === disease.title);
        setFilteredImages(filtered);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    if (disease) {
      fetchDiseaseData();
      fetchImageData();
    }
  }, [disease]);

  const handleReturnClick = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <Box p={3}>
      <Button variant="contained" onClick={handleReturnClick} sx={{ mb: 3 }}>
        Return
      </Button>
      {selectedDisease && (
        <>
          <Typography variant="h4" gutterBottom>
            {selectedDisease.title}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {selectedDisease.description}
          </Typography>
          <Divider sx={{ my: 3 }} />
        </>
      )}
      <Grid container spacing={3}>
        {filteredImages.map((image, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <ImageCard image={image} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DiseaseDetails;
