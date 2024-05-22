import { Box, useTheme, Button, Typography } from '@mui/material';
import FlexBox from 'components/flexbox/FlexBox';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  const theme = useTheme();
  return (
    <FlexBox  
      p={4} 
      alignItems="center" 
      flexDirection="column" 
      justifyContent="center"
      sx={{
        textAlign: 'center',
        bgcolor: theme.palette.background.default,
        height:'80vh'
      }} 
    >
      <Box maxWidth={350} width="100%" >
        <img src="/static/illustration/401-err.svg" width="75%" alt="Error 401" />
      </Box>
      <Typography variant="h1" fontSize={{ xs: 32, sm: 48, md: 56 }} fontWeight={600} color="primary.main" mt={2}>
        Ooops... 401!
      </Typography>
      <Typography variant="body1" color="text.secondary" fontWeight="500" mt={1}>
        You are not authorized to view this page.
      </Typography>
      <Button
      
        component={Link}
        to="/"
        variant="contained" 
        color="primary"
        sx={{ 
          mt: 3, 
          borderRadius: '50px',
          textTransform: 'none',
        }}
      >
        Back to Dashboard
      </Button>
    </FlexBox>
  );
};

export default UnauthorizedPage;
