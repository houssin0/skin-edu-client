import { Box, useTheme, Button, Typography } from '@mui/material';
import FlexBox from 'components/flexbox/FlexBox';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  const theme = useTheme();
  return (
    <FlexBox  
      p={4} 
      height="100vh" 
      alignItems="center" 
      flexDirection="column" 
      justifyContent="center"
      sx={{
        textAlign: 'center',
        bgcolor: theme.palette.background.default,
      }}
    >
      <Box maxWidth={350} width="100%">
        <img src="/static/illustration/error.svg" width="100%" alt="Error 404" />
      </Box>
      <Typography variant="h1" fontSize={{ xs: 32, sm: 48, md: 56 }} fontWeight={600} color="primary.main" mt={3}>
        Ooops... 404!
      </Typography>
      <Typography variant="body1" color="text.secondary" fontWeight="500" mt={1}>
        The page you requested could not be found.
      </Typography>
      <Button
        component={Link}
        to="/"
        variant="contained" 
        // color="primary"
        sx={{ 
          mt: 3, 
          borderRadius: '50px',
          textTransform: 'none',
          backgroundColor: '#db722d'
        }}
      >
        Back to Dashboard
      </Button>
    </FlexBox>
  );
};

export default ErrorPage;
