import React, { useState, useEffect } from "react";
import { Card, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ImageCard = ({ image }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Function to check if the screen size is mobile
  const checkMobileScreen = () => {
    const screenWidth = window.innerWidth;
    setIsMobile(screenWidth <= 768); // Adjust the threshold as needed
  };

  // Call the function once when the component mounts
  useEffect(() => {
    checkMobileScreen();
    // Event listener to update state when screen size changes
    window.addEventListener("resize", checkMobileScreen);
    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener("resize", checkMobileScreen);
    };
  }, []);

  const handleImageClick = () => {
    navigate(`/dashboard/image/${image.id}`, { state: { image } });
  };

  return (
    <Card elevation={3} style={{ position: 'relative', overflow: 'hidden', height: '100%' }}>
      <CardActionArea 
        onClick={handleImageClick} 
        onMouseEnter={() => !isMobile && setHovered(true)} 
        onMouseLeave={() => !isMobile && setHovered(false)}
      >
        <CardMedia
          component="img"
          height="200"
          image={image.url}
          alt={image.title}
          style={{ objectFit: 'cover' }}
        />
        {/* Always render the title */}
        <CardContent style={{ 
          position: 'absolute', 
          bottom: 0, 
          left: 0, 
          width: '100%', 
          backgroundColor: 'rgba(255, 255, 255, 0.5)', 
          padding: '8px', 
          transition: 'bottom 0.3s ease',
          visibility: isMobile || hovered ? 'visible' : 'hidden', /* Hide on non-hover/non-mobile */
          opacity: isMobile || hovered ? 1 : 0, /* Fade in/out effect */
          pointerEvents: isMobile || hovered ? 'auto' : 'none' /* Enable/disable pointer events */
        }}>
          <Typography gutterBottom variant="h6" component="div" style={{ textAlign: 'center' }}>
            {image.title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ImageCard;
