"use client";

const Loader = ({ size }) => {
  return (
    <>
      {size === "small" && (
        <div className="spinner border-t-4 border-black-500 border-solid rounded-full w-4 h-4"></div>
      )}
      {size === "big" && (
        <div className="spinner border-t-4 border-black-500 border-solid rounded-full w-24 h-24"></div>
      )}
    </>
  );
};

export default Loader;
