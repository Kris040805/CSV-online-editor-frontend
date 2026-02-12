import React, { useState } from "react";
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
import { uploadCsv } from "../services/api";

interface FileUploadProps {
  setRows: (rows: any[]) => void;
  setHeaders: (headers: string[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ setRows, setHeaders }) => {
  const [file, setFile] = useState<File | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<"success" | "error">("success");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

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

    try {
      const data = await uploadCsv(file); // използваме централен API service
      setSnackbarMessage("File imported successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setOpenDialog(false);

      // След upload, нулираме резултатите от SQL
      setRows([]);
      setHeaders([]);

      // Ако backend върне данни за таблицата, можем да ги сетнем тук:
      // setRows(data.rows || []);
      // setHeaders(data.headers || []);
    } catch (error) {
      setSnackbarMessage("Upload error.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <>
      <Button variant="contained" onClick={handleOpenDialog}>
        Upload CSV
      </Button>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Upload CSV File</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select a CSV file from your computer.
          </DialogContentText>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{ marginTop: 16 }}
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
      >
        <Alert severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default FileUpload;
