import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import React from "react";

const DiseaseCard = ({ disease }) => {
  const navigate = useNavigate();

  const handleDiseaseClick = () => {
    navigate(`/dashboard/disease/${disease.id}`, { state: { disease } });
  };

  return (
    <Card elevation={3}>
      <CardActionArea onClick={handleDiseaseClick}>
        <CardContent>
          <Typography gutterBottom variant="h6" component="div" style={{ textAlign: 'center', fontSize: "16px" }}>
            {disease.title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default DiseaseCard;
