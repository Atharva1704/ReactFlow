import './App.css'
import React, { useState } from "react";
import MonacoEditor from "./components/MonacoEditor";
import SchemaVisualizer from "./components/SchemaVisualizer";
import { parseSchema } from "./components/parseSchema.js";
import Navbar from './components/Navbar/Navbar';

function App() {
  const [code, setCode] = useState(
    `model User {
      id        Int     @id @default(autoincrement())
      name      String?
      role      Role    @default(USER)
    }

    enum Role {
      USER
      ADMIN
    }`
  );
  // using useEffect we need to refresh the page if any changes to the text is there

  //

  const { models, enums } = parseSchema(code);
  console.log({ models, enums });
  return (
    <div className='main-container'>
      <MonacoEditor code={code} setCode={setCode} />
      <SchemaVisualizer models={models} enums={enums} />
    </div>
  );
}

export default App
