import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";

function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Отваря диалога за избор на файл
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setSnackbarMessage("Please select a file.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    const formData = new FormData();
    formData.append("csvFile", file);

    try {
      const response = await axios.post("/api/import-csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSnackbarMessage("File imported successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      console.log(response.data);
      setOpenDialog(false); // Затваряме диалога
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Upload error.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpenDialog}>
        Upload CSV
      </Button>

      {/* Диалог за избор на файл */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Upload CSV File</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select a CSV file from your computer to import.
          </DialogContentText>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{ marginTop: "16px" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleUpload} variant="contained" color="primary">
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar за съобщения */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default FileUpload;
