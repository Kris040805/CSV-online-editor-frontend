import React, { useState } from "react";
import axios from "axios";

interface SqlExecutorProps {
    onSelectResult: (rows: any[]) => void;
}

const SqlExecutor: React.FC<SqlExecutorProps> = ({ onSelectResult }) => {
    const [query, setQuery] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    const handleExecute = async () => {
        if (!query.trim()) {
            setMessage("Please enter a SQL query.");
            return;
        }

        try {
            const response = await axios.post("/api/execute-sql", {
                query: query,
            });

            const data = response.data;

            if (data.type === "SELECT") {
                setMessage(`Returned ${data.rowsCount} rows.`);
                onSelectResult(data.rows);
            } else {
                setMessage(
                    `${data.type} successful. Affected rows: ${data.affectedRows}`
                );
                onSelectResult([]); // изчистваме таблицата
            }
        } catch (error: any) {
            if (error.response?.data?.error) {
                setMessage(error.response.data.error);
            } else {
                setMessage("SQL execution error.");
            }
        }
    };

    return (
        <div style={{ marginTop: "20px" }}>
            <h2>SQL Executor</h2>

            <textarea
                rows={4}
                style={{ width: "100%" }}
                placeholder="Write your SQL query here..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            <br />
            <button onClick={handleExecute}>RUN</button>

            <p>{message}</p>
        </div>
    );
};

export default SqlExecutor;
