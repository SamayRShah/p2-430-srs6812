import React, { useState } from "react";

const FormInput = ({ value, size, label, ...other }) => {
  const [val, setVal] = useState(value || "");
  return (
    <label className="form-control w-full max-w-xs">
      <div className="label">
        <span className="label-text text-neutral-content">{label}</span>
      </div>
      <input
        {...other}
        className={`input input-bordered input-${size || "lg"} w-full max-w-xs`}
        value={val}
        onChange={(e) => setVal(e.target.value)}
      />
    </label>
  );
};

export default FormInput;
