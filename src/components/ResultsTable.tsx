import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography
} from "@mui/material";

type Props = {
    rows: Record<string, any>[];
};

const ResultsTable: React.FC<Props> = ({ rows }) => {
    // Ако няма резултати
    if (!rows || rows.length === 0) {
        return (
            <Typography sx={{ mt: 2 }}>
                No results to display.
            </Typography>
        );
    }

    // Взимаме колоните динамично от първия ред
    const headers = Object.keys(rows[0]);

    return (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        {headers.map((header) => (
                            <TableCell key={header} sx={{ fontWeight: "bold" }}>
                                {header}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {rows.map((row, index) => (
                        <TableRow key={index} hover>
                            {headers.map((header) => (
                                <TableCell key={header}>
                                    {row[header]?.toString()}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ResultsTable;
