import React, { useState, useEffect, useRef } from "react";
import { grey } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import { 
  InputBase, 
  Button, 
  Tooltip, 
  Paper, 
  List, 
  ListItem, 
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  CircularProgress,
  ClickAwayListener,
  Fade
} from "@material-ui/core";
import { Search as SearchIcon, PlayArrow as PlayIcon } from "@material-ui/icons";
import { withRouter } from "react-router";
import axios from "axios";
import { BACKEND_URL } from "../../../config";

const api = axios.create({
  withCredentials: true,
  baseURL: BACKEND_URL,
});

const useStyles = makeStyles((theme) => ({
  searchContainer: {
    position: "relative",
    width: "100%",
  },
  searchButton: {
    color: grey[700],
    backgroundColor: grey[200],
    "&:hover": {
      backgroundColor: grey[200],
    },
    "&:focus": {
      outline: "none",
    },
    borderLeftStyle: "solid",
    borderLeftWidth: "1px",
    borderLeftColor: grey[300],
    borderRadius: 0,
  },
  border: {
    borderColor: grey[300],
    borderStyle: "solid",
    borderWidth: "1px",
    borderRadius: 0,
  },
  searchForm: {
    backgroundColor: "white",
    width: "100%",
  },
  input: {
    padding: theme.spacing(0, 1),
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    zIndex: 1000,
    maxHeight: "400px",
    overflow: "auto",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
    border: "1px solid #e0e0e0",
    borderRadius: "0 0 4px 4px",
  },
  searchResult: {
    cursor: "pointer",
    "&:hover": {
      backgroundColor: grey[100],
    },
    padding: theme.spacing(1, 2),
  },
  searchResultContent: {
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  thumbnail: {
    width: 40,
    height: 30,
    marginRight: theme.spacing(1),
    objectFit: "cover",
    borderRadius: 2,
  },
  resultText: {
    flex: 1,
    overflow: "hidden",
  },
  title: {
    fontSize: "0.875rem",
    fontWeight: 500,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  channel: {
    fontSize: "0.75rem",
    color: grey[600],
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    padding: theme.spacing(2),
  },
  noResults: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: grey[600],
  },
  searchIcon: {
    color: grey[500],
    marginRight: theme.spacing(1),
  },
}));

const LiveSearch = ({ history }) => {
  const [searchValue, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [debouncedValue, setDebouncedValue] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const classes = useStyles();
  const searchTimeoutRef = useRef(null);

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("searchHistory");
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (err) {
        console.error("Error loading search history:", err);
      }
    }
  }, []);

  // Save search to history
  const saveToHistory = (query) => {
    if (!query.trim()) return;
    
    const newHistory = [
      query,
      ...searchHistory.filter(item => item !== query)
    ].slice(0, 5); // Keep only last 5 searches
    
    setSearchHistory(newHistory);
    localStorage.setItem("searchHistory", JSON.stringify(newHistory));
  };

  // Debounce search input
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchValue.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        setDebouncedValue(searchValue);
      }, 300); // 300ms delay
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchValue]);

  // Fetch search results when debounced value changes
  useEffect(() => {
    if (debouncedValue.trim()) {
      fetchSearchResults(debouncedValue);
    }
  }, [debouncedValue]);

  const fetchSearchResults = async (query) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setShowDropdown(true);

    try {
      const {
        data: { videos },
      } = await api.get(`/api/videos/search?search_query=${encodeURIComponent(query)}`);
      

      setSearchResults(videos || []);
    } catch (err) {
      console.error("Search error:", err);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchValue.trim()) {
      saveToHistory(searchValue);
      history.push(`/results?search_query=${encodeURIComponent(searchValue)}`);
      setShowDropdown(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleResultClick = (video) => {
    const videoId = video._id || video.id;
    if (videoId) {
      history.push(`/watch?v=${videoId}`);
      setShowDropdown(false);
      setSearch("");
    } else {
      console.error("Video ID not found:", video);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClickAway = () => {
    setShowDropdown(false);
  };

  const handleInputFocus = () => {
    if (searchHistory.length > 0 || searchValue.trim()) {
      setShowDropdown(true);
    }
  };

  const renderSearchResults = () => {
    // Show search history when no search value and dropdown is open
    if (!searchValue.trim() && searchHistory.length > 0) {
      return (
        <List dense>
          <ListItem>
            <Typography variant="subtitle2" color="textSecondary">
              Recent searches
            </Typography>
          </ListItem>
          {searchHistory.map((query, index) => (
            <ListItem
              key={index}
              className={classes.searchResult}
              onClick={() => {
                setSearch(query);
                history.push(`/results?search_query=${encodeURIComponent(query)}`);
                setShowDropdown(false);
              }}
            >
              <div className={classes.searchResultContent}>
                <SearchIcon className={classes.searchIcon} />
                <Typography className={classes.title}>
                  {query}
                </Typography>
              </div>
            </ListItem>
          ))}
        </List>
      );
    }

    if (isLoading) {
      return (
        <div className={classes.loadingContainer}>
          <CircularProgress size={24} />
        </div>
      );
    }

    if (searchResults.length === 0 && searchValue.trim()) {
      return (
        <div className={classes.noResults}>
          <Typography variant="body2">
            No videos found for "{searchValue}"
          </Typography>
        </div>
      );
    }

    return (
      <List dense>
        {searchResults.slice(0, 8).map((video) => {
          const videoId = video._id || video.id;
          const thumbnailSrc = video.thumbnailFilename 
            ? `${BACKEND_URL}/api/videos/thumbnails/${video.thumbnailFilename}`
            : video.thumbnailLink || "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCA0MCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xNiAxMkwxMiAxNkwxNiAyMEwyNCAxMkwxNiAxMloiIGZpbGw9IiM5OTk5OTkiLz4KPC9zdmc+";
          
          return (
            <ListItem
              key={videoId}
              className={classes.searchResult}
              onClick={() => handleResultClick(video)}
            >
              <div className={classes.searchResultContent}>
                <img
                  src={thumbnailSrc}
                  alt={video.title || "Video thumbnail"}
                  className={classes.thumbnail}
                  onError={(e) => {
                    e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCA0MCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xNiAxMkwxMiAxNkwxNiAyMEwyNCAxMkwxNiAxMloiIGZpbGw9IiM5OTk5OTkiLz4KPC9zdmc+";
                  }}
                />
                <div className={classes.resultText}>
                  <Typography className={classes.title}>
                    {video.title || "Untitled Video"}
                  </Typography>
                  <Typography className={classes.channel}>
                    {video.uploader?.name || video.channelName || "Unknown Channel"}
                  </Typography>
                </div>
                <PlayIcon className={classes.searchIcon} fontSize="small" />
              </div>
            </ListItem>
          );
        })}
        {searchResults.length > 8 && (
          <ListItem className={classes.searchResult} onClick={handleSearch}>
            <div className={classes.searchResultContent}>
              <SearchIcon className={classes.searchIcon} />
              <Typography variant="body2" color="primary">
                View all {searchResults.length} results for "{searchValue}"
              </Typography>
            </div>
          </ListItem>
        )}
      </List>
    );
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div className={classes.searchContainer}>
        <div className={classes.searchForm}>
          <InputBase
            fullWidth
            value={searchValue}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            onFocus={handleInputFocus}
            className={classes.border}
            classes={{
              input: classes.input,
            }}
            placeholder="Search videos..."
            inputProps={{ "aria-label": "search" }}
            endAdornment={
              <Tooltip title="Search">
                <Button
                  disableRipple
                  size="small"
                  type="submit"
                  className={classes.searchButton}
                  onClick={handleSearch}
                  aria-label="search"
                >
                  <SearchIcon fontSize="small" />
                </Button>
              </Tooltip>
            }
          />
        </div>
        
        {showDropdown && (searchValue.trim() || isLoading || searchHistory.length > 0) && (
          <Fade in={showDropdown}>
            <Paper className={classes.dropdown}>
              {renderSearchResults()}
            </Paper>
          </Fade>
        )}
      </div>
    </ClickAwayListener>
  );
};

export default withRouter(LiveSearch); 