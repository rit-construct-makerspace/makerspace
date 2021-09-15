import React from "react";
import { DestructiveButton, NormalButton } from "./components/common/Button";

function App() {
  return (
    <div>
      <NormalButton label="Normal" onClick={() => {}} />
      <DestructiveButton label="Destructive" onClick={() => {}} />
      <NormalButton label="Disabled Normal" disabled onClick={() => {}} />
      <DestructiveButton
        label="Disabled Destructive"
        disabled
        onClick={() => {}}
      />
    </div>
  );
}

export default App;
