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

type Props = {
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  setRows: React.Dispatch<React.SetStateAction<Record<string, any>[]>>;
};

const FileUpload: React.FC<Props> = ({ setMessage, setRows }) => {
  const [file, setFile] = useState<File | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<"success" | "error">("success");

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
      setMessage("Please select a file.");
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

      setRows([]); // изчистваме старата таблица
      setMessage(
        `File imported successfully. Rows: ${response.data.rows}, Columns: ${response.data.columns}`
      );

      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setOpenDialog(false);
      setFile(null);
    } catch (error: any) {
      setMessage(error.response?.data?.error || "Upload error.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <Button variant="contained" onClick={handleOpenDialog}>
        Upload CSV
      </Button>

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
          <Button variant="contained" onClick={handleUpload}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbarSeverity}
          onClose={() => setOpenSnackbar(false)}
          sx={{ width: "100%" }}
        >
          {snackbarSeverity === "success"
            ? "File uploaded successfully!"
            : "Upload failed!"}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default FileUpload;
