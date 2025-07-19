import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import queryString from "query-string";
import {
  Container,
  makeStyles,
  useTheme,
  useMediaQuery,
  Typography,
  Chip,
  Box,
  Divider,
} from "@material-ui/core";
import { Search as SearchIcon } from "@material-ui/icons";
import axios from "axios";

import VideoList from "../Video/VideoList";
import { BACKEND_URL } from "../../config";

const api = axios.create({
  withCredentials: true,
  baseURL: BACKEND_URL,
});

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(3),
  },
  searchHeader: {
    marginBottom: theme.spacing(3),
  },
  searchQuery: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(2),
  },
  searchIcon: {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
  resultCount: {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
  },
  suggestions: {
    marginBottom: theme.spacing(3),
  },
  suggestionChip: {
    margin: theme.spacing(0.5),
  },
  noResults: {
    textAlign: "center",
    padding: theme.spacing(4),
    color: theme.palette.text.secondary,
  },
  noResultsIcon: {
    fontSize: "4rem",
    marginBottom: theme.spacing(2),
    color: theme.palette.grey[400],
  },
}));
const SearchPage = ({ location, history }) => {
  const { search_query } = queryString.parse(location.search);
  const [videoResults, setVideoResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const classes = useStyles();
  const theme = useTheme();
  const isMaxScreenSm = useMediaQuery(theme.breakpoints.only("xs"));

  // Search suggestions based on the query
  const getSearchSuggestions = (query) => {
    if (!query) return [];
    
    const suggestions = [
      `${query} tutorial`,
      `${query} 2024`,
      `${query} latest`,
      `${query} best`,
      `${query} review`,
      `${query} how to`,
      `${query} tips`,
    ];
    
    return suggestions.slice(0, 5);
  };

  useEffect(() => {
    const fetchVideoContent = async () => {
      if (!search_query) return;
      
      setIsLoading(true);
      try {
        const {
          data: { videos },
        } = await api.get(`/api/videos/search?search_query=${encodeURIComponent(search_query)}`);
        setVideoResult(videos || []);
      } catch (err) {
        console.error("Search error:", err);
        setVideoResult([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVideoContent();
  }, [search_query]);

  if (!search_query) {
    return <Redirect to="/" />;
  }

  const handleSuggestionClick = (suggestion) => {
    history.push(`/results?search_query=${encodeURIComponent(suggestion)}`);
  };

  return (
    <Container maxWidth="xl" className={classes.root}>
      <div className={classes.searchHeader}>
        <div className={classes.searchQuery}>
          <SearchIcon className={classes.searchIcon} />
          <Typography variant="h5">
            Search results for "{search_query}"
          </Typography>
        </div>
        
        <Typography variant="body2" className={classes.resultCount}>
          {isLoading ? "Searching..." : `${videoResults.length} videos found`}
        </Typography>

        {videoResults.length > 0 && (
          <div className={classes.suggestions}>
            <Typography variant="subtitle2" gutterBottom>
              Try searching for:
            </Typography>
            <Box>
              {getSearchSuggestions(search_query).map((suggestion, index) => (
                <Chip
                  key={index}
                  label={suggestion}
                  clickable
                  className={classes.suggestionChip}
                  onClick={() => handleSuggestionClick(suggestion)}
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className={classes.noResults}>
          <SearchIcon className={classes.noResultsIcon} />
          <Typography variant="h6">Searching...</Typography>
        </div>
      ) : videoResults.length > 0 ? (
        isMaxScreenSm ? (
          <VideoList type="vertical_2" videos={videoResults} />
        ) : (
          <VideoList type="horizontal_1" videos={videoResults} />
        )
      ) : (
        <div className={classes.noResults}>
          <SearchIcon className={classes.noResultsIcon} />
          <Typography variant="h6">No videos found</Typography>
          <Typography variant="body2">
            Try different keywords or check your spelling
          </Typography>
        </div>
      )}
    </Container>
  );
};

export default SearchPage;
