import { BusinessCenter, Mail, Place } from "@mui/icons-material";
import { Box, Card, Divider, Grid, styled } from "@mui/material";
import FlexBox from "components/flexbox/FlexBox";
// import MoreOptions from "components/MoreOptions";
import { H3, H4, H6, Small } from "components/Typography";
import FollowerIcon from "icons/FollowerIcon";
import UserPlusIcon from "icons/UserPlusIcon";
// import { useState } from "react";
import { useTranslation } from "react-i18next";
// import PostCard from "./PostCard"; // styled components

const IconWrapper = styled(Box)(({
  theme,
  color
}) => ({
  width: 40,
  height: 40,
  color: "white",
  display: "flex",
  borderRadius: "4px",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: color ? color : theme.palette.primary.main
}));
const FollowWrapper = styled(Box)(() => ({
  maxWidth: 300,
  margin: "auto",
  paddingTop: 32,
  paddingBottom: 32,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between"
}));

const Profile = () => {
  const {
    t
  } = useTranslation();
  // const [setMoreEl] = useState(null);

  // const handleMoreOpen = event => {
  //   setMoreEl(event.currentTarget);
  // };

  // const handleMoreClose = () => setMoreEl(null);

  return <Grid container spacing={3}>
      <Grid >
      <Card >
                  <FollowWrapper>
            <FlexBox alignItems="center">
              <IconWrapper>
                <UserPlusIcon fontSize="small" />
              </IconWrapper>
              <Box marginLeft={1.5}>
                <Small color="text.secondary" lineHeight={1}>
                  {t("Following")}
                </Small>
                <H3 lineHeight={1} mt={0.6}>
                  18
                </H3>
              </Box>
            </FlexBox>
            <FlexBox alignItems="center">
              <IconWrapper color="#FF9777">
                <FollowerIcon fontSize="small" />
              </IconWrapper>
              <Box marginLeft={1.5}>
                <Small color="text.secondary" lineHeight={1}>
                  {t("Followers")}
                </Small>
                <H3 lineHeight={1} mt={0.6}>
                  52
                </H3>
              </Box>
            </FlexBox>
          </FollowWrapper>

          <Divider />

          <Box padding={3}>
            <H4 fontWeight={600}>{t("About")}</H4>
            <Small mt={1} display="block" lineHeight={1.9}>
            Professeur de dermatologie, est spécialisé dans les maladies de la peau et les traitements innovants, avec plus de 20 ans d'expérience clinique et académique. Auteur de nombreuses publications, il est reconnu pour ses recherches sur les maladies auto-immunes cutanées.
            </Small>

            <Box mt={3}>
              {details.map(({
              Icon,
              smallText,
              boldText
            }, index) => <FlexBox alignItems="center" mt={1.5} key={index}>
                  <Icon sx={{
                color: "text.secondary"
              }} />
                  <H6 marginLeft={1}>
                    <Small color="text.secondary">{smallText}</Small> {boldText}
                  </H6>
                </FlexBox>)}
            </Box>
          </Box>
        </Card>
      </Grid>

      {/* <Grid item md={7} xs={12}>
        {postList.map(post => <PostCard post={post} key={post.id} handleMore={handleMoreOpen} />)}

        <MoreOptions anchorEl={moreEl} handleMoreClose={handleMoreClose} />
      </Grid> */}
    </Grid>;
};

const details = [{
  Icon: Place,
  boldText: "Morocco",
  smallText: "Lives at"
}, {
  Icon: Mail,
  boldText: "",
  smallText: "Lenore_Rosenbaum@gmail.com"
},  {
  Icon: BusinessCenter,
  smallText: "Doctorat",
  boldText: "Médecine Université de Paris, 1990"
}];
// const postList = [{
//   id: 1,
//   postTitle: "Coffee and Afternoon",
//   postImage: "/static/post-image/post-1.png"
// }, {
//   id: 2,
//   postTitle: "Coffee and Afternoon",
//   postImage: ""
// }];
export default Profile;