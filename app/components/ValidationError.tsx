import React from "react";

const ValidationError = ({ errorMessage }: { errorMessage: string }) => {
  return <p className="mt-2 text-red-500">{errorMessage}</p>;
};

export default ValidationError;
