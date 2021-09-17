import * as React from "react";
import LeftNav from "./LeftNav";
import { BrowserRouter } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <LeftNav />
    </BrowserRouter>
  );
}
