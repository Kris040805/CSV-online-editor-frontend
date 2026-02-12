import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import SqlExecutor from "./components/SqlExecutor";
import ResultsTable from "./components/ResultsTable";
import { Container, Typography } from "@mui/material";

function App() {
  const [rows, setRows] = useState<Record<string, any>[]>([]);
  const [message, setMessage] = useState("");

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        CSV Online SQL Editor
      </Typography>

      <FileUpload
        setMessage={setMessage}
        setRows={setRows}
      />


      <SqlExecutor
        setRows={setRows}
        setMessage={setMessage}
      />

      {message && (
        <Typography sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}

      <ResultsTable rows={rows} />
    </Container>
  );
}

export default App;
