// Dependencies
import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";

// Style
import "index.scss";

// React Application
import Application from "components/Application";

// Sets URL for axios requests to database
if (process.env.REACT_APP_API_BASE_URL) {
  axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;
}

// Renders application
ReactDOM.render(<Application />, document.getElementById("root"));
