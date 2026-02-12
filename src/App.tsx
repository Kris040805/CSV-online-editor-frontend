import React, { useState } from "react";
import { Container, Typography, Box, Paper } from "@mui/material";

import FileUpload from "./components/FileUpload";
import SqlExecutor from "./components/SqlExecutor";
import ResultsTable from "./components/ResultsTable";

function App() {
  // Централно state за таблицата
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<any[]>([]);

  return (
    <Container maxWidth="lg">
      <Box mt={4} mb={4}>
        <Typography variant="h4" align="center" gutterBottom>
          CSV Online SQL Editor
        </Typography>

        {/* Upload Section */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <FileUpload setRows={setRows} setHeaders={setHeaders} />
        </Paper>

        {/* SQL Section */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <SqlExecutor
            setHeaders={setHeaders}
            setRows={setRows}
          />
        </Paper>

        {/* Results Section */}
        <Paper elevation={3} sx={{ p: 3 }}>
          <ResultsTable
            headers={headers}
            rows={rows}
          />
        </Paper>
      </Box>
    </Container>
  );
}

export default App;
