import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { executeSql, exportCsv } from "../services/api";

interface SqlExecutorProps {
  setHeaders: (headers: string[]) => void;
  setRows: (rows: any[]) => void;
}

const SqlExecutor: React.FC<SqlExecutorProps> = ({ setHeaders, setRows }) => {
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [severity, setSeverity] = useState<"success" | "error">("success");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  // За export
  const [exporting, setExporting] = useState<boolean>(false);

  const handleExecute = async () => {
    if (!query.trim()) {
      setMessage("SQL query cannot be empty.");
      setSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      setLoading(true);

      const data = await executeSql(query);

      if (data.type === "SELECT") {
        if (data.rows && data.rows.length > 0) {
          const headers = Object.keys(data.rows[0]);
          setHeaders(headers);
        } else {
          setHeaders([]);
        }

        setRows(data.rows || []);
        setMessage(`Query executed. Returned ${data.rowsCount} rows.`);
        setSeverity("success");
      } else {
        setHeaders([]);
        setRows([]);
        setMessage(
          `${data.type} executed successfully. Affected rows: ${data.affectedRows}`
        );
        setSeverity("success");
      }
    } catch (error: any) {
      console.error(error);
      setMessage(error.response?.data?.error || "SQL execution failed.");
      setSeverity("error");
    } finally {
      setLoading(false);
      setOpenSnackbar(true);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      // Изпращаме tableName "current" – backend да реши коя таблица
      const csvData = await exportCsv("temporary_table");

      // Създаваме Blob и trigger на download
      const blob = new Blob([csvData], { type: "text/csv" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "export.csv";
      link.click();

      URL.revokeObjectURL(url); // почистваме

      setMessage("CSV exported successfully!");
      setSeverity("success");
    } catch (error) {
      console.error(error);
      setMessage("CSV export failed.");
      setSeverity("error");
    } finally {
      setExporting(false);
      setOpenSnackbar(true);
    }
  };

  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>
        SQL Executor
      </Typography>

      <TextField
        label="Write your SQL query"
        multiline
        minRows={4}
        fullWidth
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        variant="outlined"
      />

      <Box mt={2} display="flex" alignItems="center" gap={2}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleExecute}
          disabled={loading || !query.trim()}
        >
          RUN
        </Button>

        {loading && <CircularProgress size={24} />}

        <Button
          variant="outlined"
          color="primary"
          onClick={handleExport}
          disabled={exporting}
        >
          Export CSV
        </Button>

        {exporting && <CircularProgress size={24} />}
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={severity}
          onClose={() => setOpenSnackbar(false)}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SqlExecutor;
