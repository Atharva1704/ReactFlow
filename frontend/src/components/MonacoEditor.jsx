import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import "./MonacoEditor.css";

const defaultPrismaSchema = `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
}`;

const MonacoEditor = () => {
    const [editorValue, setEditorValue] = useState(() => {
        // Retrieve from localStorage or use default schema
        return localStorage.getItem("prisma_schema") || defaultPrismaSchema;
    });

    // Handle changes in the editor
    const handleEditorChange = (value) => {
        setEditorValue(value); // Update the state with the current editor value
    };

    // Save the value to local storage when the button is clicked
    const handleSaveToLocalStorage = () => {
        localStorage.setItem("prisma_schema", editorValue);
        alert("Prisma Schema saved successfully!");
        window.location.reload(); // Refresh the page
    };

    return (
        <div className="prisma-editor-container">
            <div className="editor-header">
                <h1>Prisma Schema Editor</h1>
                <button
                    onClick={handleSaveToLocalStorage}
                    className="save-button"
                >
                    Save Schema
                </button>
            </div>
            <div className="editor-wrapper">
                <Editor
                    height="80vh"
                    defaultLanguage="plaintext"
                    theme="vs-dark"
                    value={editorValue}
                    onChange={handleEditorChange}
                    options={{
                        // minimap: { enabled: false },
                        fontSize: 14,
                        wordWrap: 'on',
                        automaticLayout: true,
                    }}
                />
            </div>
        </div>
    );
};

export default MonacoEditor;