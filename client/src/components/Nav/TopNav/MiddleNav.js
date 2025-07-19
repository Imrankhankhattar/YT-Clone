import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Toolbar, Hidden } from "@material-ui/core";
import LiveSearch from "./LiveSearch";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

const MiddleNav = () => {
  const classes = useStyles();

  return (
    <Hidden xsDown>
      <Toolbar className={classes.root} disableGutters>
        <LiveSearch />
      </Toolbar>{" "}
    </Hidden>
  );
};

export default MiddleNav;
