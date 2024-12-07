import './App.css'
import React, { useState } from "react";
import MonacoEditor from "./components/MonacoEditor/MonacoEditor";
import SchemaVisualizer from "./components/SchemaVisualizer/SchemaVisualizer";
import { parseSchema } from "./components/utils/parseSchema.js";
import Navbar from './components/Navbar/Navbar';

function App() {
  const [code, setCode] = useState(
    ``
  );
  const { models, enums } = parseSchema(code);
  return (
    <div className='main-container'>
      <MonacoEditor code={code} setCode={setCode} />
      <SchemaVisualizer models={models} enums={enums} />
    </div>
  );
}

export default App
