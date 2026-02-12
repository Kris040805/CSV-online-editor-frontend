import React, { useState } from "react";
import axios from "axios";
import { Button, TextField } from "@mui/material";

type Props = {
    setRows: React.Dispatch<React.SetStateAction<Record<string, any>[]>>;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
};

const SqlExecutor: React.FC<Props> = ({ setRows, setMessage }) => {
    const [query, setQuery] = useState("");

    const handleExecute = async () => {
        if (!query.trim()) {
            setMessage("SQL query cannot be empty.");
            return;
        }

        try {
            const response = await axios.post("/api/execute-sql", {
                query: query,
            });

            const data = response.data;

            if (data.type === "SELECT") {
                setRows(data.rows);
                setMessage(`Returned ${data.rowsCount} rows.`);
            } else {
                setRows([]); // изчистваме таблицата
                setMessage(
                    `${data.type} successful. Affected rows: ${data.affectedRows}`
                );
            }
        } catch (error: any) {
            setRows([]);
            setMessage(
                error.response?.data?.error || "SQL execution error."
            );
        }
    };

    return (
        <div style={{ marginTop: "20px" }}>
            <TextField
                label="Write your SQL query"
                multiline
                rows={4}
                fullWidth
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={handleExecute}
            >
                RUN
            </Button>
        </div>
    );
};

export default SqlExecutor;
