import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import SqlExecutor from "./components/SqlExecutor";

function App() {
    const [rows, setRows] = useState<any[]>([]);

    return (
        <div style={{ padding: "20px" }}>
            <h1>CSV Online SQL Editor</h1>

            <FileUpload />

            <SqlExecutor onSelectResult={setRows} />
        </div>
    );
}

export default App;
