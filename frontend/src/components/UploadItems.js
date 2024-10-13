import { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  IconButton
} from "@mui/material";
import { FaFileUpload } from "react-icons/fa";
import { Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function UploadItems() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setMessage("");
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5127/api/items/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response && response.data) {
        setMessage(response.data);
      } else {
        setMessage("Unexpected response from the server.");
      }
    } catch (error) {
      if (error.response && error.response.data) {
      setMessage(`Error uploading file: ${error.response.data}`);
    } else {
      setMessage("An unknown error occurred.");
    }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "background.default",
        padding: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          width: "100%",
          maxWidth: 400,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <IconButton
          onClick={handleCancel}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
          }}
        >
          <Close />
        </IconButton>

        <Typography variant="h4" color="primary" textAlign="center">
          Upload Items CSV
        </Typography>

        <form onSubmit={handleUpload} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Button
          variant="outlined"
          component="label"
          fullWidth
          sx={{
            height: 120,
            fontSize: "1.2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            textTransform: "none",
            flexDirection: "column",
          }}
        >
          <FaFileUpload size={34} />
          {file ? file.name : "Choose a File"}
          <input
            type="file"
            accept=".csv"
            hidden
            onChange={handleFileChange}
          />
        </Button>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? "Uploading..." : "Upload CSV"}
          </Button>
        </form>

        {message && (
          <Alert severity={message.startsWith("Error") ? "error" : "info"}>
            {message}
          </Alert>
        )}
      </Paper>
    </Box>
  );
}

export default UploadItems;
