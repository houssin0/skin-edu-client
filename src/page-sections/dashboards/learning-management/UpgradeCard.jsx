import { Box, ButtonBase, Card } from "@mui/material";
import FlexBetween from "components/flexbox/FlexBetween";
import { H3, Span } from "components/Typography";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useContext } from 'react';
import AuthContext from '../../../contexts/JWTAuth';

const UpgradeCard = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const { user } = useContext(AuthContext);

  return (
    <Card sx={{
      height: "100%",
      position: "relative",
      padding: "1rem 1.5rem",
      background: theme => theme.palette.mode === "light" ? "linear-gradient(250.16deg, #FFFFFF 2.51%, rgba(213, 241, 255, 0.54) 96.8%)" : "background.paper"
    }}>
      <FlexBetween>
        <Box maxWidth={200} width="100%">
          <H3 fontWeight={700} mb={1}>
            A new <Span color="primary.main" style={{ fontSize: 'larger' }}>Quiz</Span> is Available Today
          </H3>
          <ButtonBase
            sx={{
              fontSize: 12,
              fontWeight: 600,
              borderRadius: "4px",
              color: "common.white",
              padding: "0.8rem 2rem",
              background: "linear-gradient(180deg, rgba(0, 172, 255, 0.46) 0%, rgba(189, 0, 255, 0.345) 100%)"
            }}
            onClick={() => navigate(user.userType === "med_teacher" ? "/make-a-quiz" : "/take-a-quiz")} // Add onClick handler with conditional navigation
          >
            Start Now
          </ButtonBase>
        </Box>

        <Box sx={{
          position: "absolute",
          right: 0,
          bottom: -10,
          width: 150
        }}>
          <img src="/static/illustration/upgrade-pro.png" width="100%" alt="Upgrade Pro" />
        </Box>
      </FlexBetween>
    </Card>
  );
};

export default UpgradeCard;
