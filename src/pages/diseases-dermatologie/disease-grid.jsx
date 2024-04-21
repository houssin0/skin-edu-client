import { Box, Grid, styled } from "@mui/material";
import DiseaseCard from "./disease-card";
import { DiseaseList } from "./disease-list";
import React from "react";

// Styled component for the container box
const StyledContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
}));

// Styled component for the grid container
const StyledGridContainer = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const DiseaseGrid = () => {
  // Change navbar title

  return (
    <StyledContainer>
      <StyledGridContainer container spacing={3}>
        {DiseaseList.map((disease, index) => (
          <Grid item xs={12} sm={6} md={4} key={disease.id}>
            <DiseaseCard disease={disease} />
          </Grid>
        ))}
      </StyledGridContainer>
    </StyledContainer>
  );
};

export default DiseaseGrid;
