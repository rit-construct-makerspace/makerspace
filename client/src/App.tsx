import React from "react";
import Button, { ButtonType } from "./components/common/Button";

function App() {
  return (
    <div>
      <Button label="Approve" onClick={() => alert("hello")} />
      <Button label="Scary Button" buttonType={ButtonType.Destructive} />
      <Button label="Disabled Button" disabled />
    </div>
  );
}

export default App;
