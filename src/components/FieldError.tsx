import React from "react";

const FieldError = ({ error, text }) => {
  if (!error) return <></>;
  return <span className="text-danger-red text-sm">{text}</span>;
};

export default FieldError;
