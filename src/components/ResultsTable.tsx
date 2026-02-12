import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

interface ResultsTableProps {
  rows: Record<string, any>[];
}

const ResultsTable: React.FC<ResultsTableProps> = ({ rows }) => {
  if (!rows || rows.length === 0) {
    return <Typography sx={{ mt: 2 }}>No results to display.</Typography>;
  }

  const headers = Object.keys(rows[0]);

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableCell key={header} sx={{ fontWeight: "bold" }}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i} hover sx={{ bgcolor: i % 2 === 0 ? "#f9f9f9" : "white" }}>
              {headers.map((header) => (
                <TableCell key={header} sx={{ border: "1px solid #ddd" }}>{row[header]?.toString()}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ResultsTable;
