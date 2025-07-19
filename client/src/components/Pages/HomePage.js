import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  makeStyles,
  Container,
  Typography,
  Divider,
  createMuiTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@material-ui/core/";

import VideoGrid from "../Video/VideoGrid";
import { getHomeVideos } from "../../redux/actions/videos";
import Banner from "../Banner";
import youtubeIcon from "../../assets/youtube-icon.png";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(3),
  },
  text: {
    paddingBottom: theme.spacing(3),
    fontWeight: 500,
  },
  divider: {
    height: "5px",
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  banner: {
    width: "100%",
    backgroundColor: "black",
    color: "white",
    display: "flex",
    padding: theme.spacing(1),
    alignItems: "center",
  },
  bannerImg: {
    width: "100%",
    maxWidth: 150,
    height: "auto",
    margin: theme.spacing(1.5),
  },
}));

const HomePage = () => {
  const recommendedVids = useSelector(({ videos }) => videos.recommended);
  const trendingVids = useSelector(({ videos }) => videos.trending);
  const isLoading = useSelector(({ videos }) => videos.isLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getHomeVideos());
  }, []);
  const classes = useStyles();
  let theme = createMuiTheme();
  theme = responsiveFontSizes(theme);
  return (
    <div>
      <Banner closeable>
        <div className={classes.banner}>
          <img
            className={classes.bannerImg}
            alt="youtube icon"
            src={youtubeIcon}
          />
          <div>
            <ThemeProvider theme={theme}>
  <Typography variant="h2" color="primary" gutterBottom>
    🎥 YouTube Clone – Full Stack Edition
  </Typography>

  <Typography variant="h5" gutterBottom>
    Built using React, Node.js & MongoDB
  </Typography>

  {/* <Typography variant="h6">
    Explore the code on{" "}
    <a
      href="https://github.com/smfils1/youtube-clone"
      style={{ color: "#ff0000", textDecoration: "none", fontWeight: "bold" }}
    >
      GitHub ↗
    </a>
  </Typography>

  <Typography variant="body2" color="textSecondary" mt={2}>
    🚨 For Educational Purposes Only — Not Affiliated with YouTube
  </Typography> */}
</ThemeProvider>

          </div>
        </div>
      </Banner>
      <Container maxWidth="xl" className={classes.root}>
        <Typography variant="h5" className={classes.text}>
          Recommended
        </Typography>

        <VideoGrid
          type="vertical_2"
          isLoading={isLoading}
          videos={recommendedVids}
        />
        <Divider light className={classes.divider} />
        <Typography variant="h5" className={classes.text}>
          Trending
        </Typography>
        <VideoGrid
          type="vertical_2"
          isLoading={isLoading}
          videos={trendingVids}
        />
      </Container>
    </div>
  );
};

export default HomePage;
