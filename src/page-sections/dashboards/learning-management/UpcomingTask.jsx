import { MoreHoriz } from "@mui/icons-material";
import { Box, Card, IconButton } from "@mui/material";
import FlexBetween from "components/flexbox/FlexBetween";
import { H5, Paragraph, Tiny } from "components/Typography";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

const UpcomingTask = () => {
  const { t } = useTranslation();

  return (
    <Card sx={{ padding: 3, height: "100%"}}>
      <FlexBetween>
        <H5>{t("Upcoming Task")}</H5>
        <NavLink to="#" style={{ fontSize: 13 }}>
          View all Tasks
        </NavLink>
      </FlexBetween>

      <Box>
        {TASKS.map(item => (
          <FlexBetween mt={3} key={item.id}>
            <Box
              sx={{
                position: "relative",
                pl: 2,
                "&::after": {
                  top: 0,
                  left: 0,
                  width: "4px",
                  content: '""',
                  height: "100%",
                  borderRadius: 16,
                  position: "absolute",
                  backgroundColor: "primary.400"
                }
              }}
            >
              <Paragraph>{item.title}</Paragraph>
              <Tiny lineHeight={1.5}>{item.time}</Tiny>
            </Box>

            <IconButton>
              <MoreHoriz color="disabled" />
            </IconButton>
          </FlexBetween>
        ))}
      </Box>
    </Card>
  );
};

const TASKS = [
  { id: 1, title: "Identifier les Affections Cutanées Courantes", time: "09:00 AM - 10:00 AM" },
  { id: 2, title: "Techniques de Traitement Dermatologique", time: "11:00 AM - 12:00 PM" },
  { id: 3, title: "Sensibilisation au Cancer de la Peau", time: "01:00 PM - 02:00 PM" },
  { id: 4, title: "Dermatologie Pédiatrique", time: "03:00 PM - 04:00 PM" },
  { id: 5, title: "Procédures de Dermatologie Cosmétique", time: "05:00 PM - 06:00 PM" }
];

export default UpcomingTask;
