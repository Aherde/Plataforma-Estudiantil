import React from "react";

export default function Tabs({ active, setActive }) {
  const tabs = ["Alumno", "Madre", "Padre", "Representante"];

  return (
    <div className="tabs">
      {tabs.map(tab => (
        <button
          key={tab}
          className={active === tab ? "tab-button active" : "tab-button"}
          onClick={() => setActive(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}