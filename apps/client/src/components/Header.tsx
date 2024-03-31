import React from "react";

const Header = () => {
  return (
    <div className="mb-6 text-center">
      <h1 className="mb-4 mt-4 text-5xl font-semibold tracking-[-1.2px] sm:text-7xl sm:leading-[72px]">
        Focus in parallel with{" "}
        <span className=" bg-gradient-to-tr from-sky-400 to-purple-500 bg-clip-text text-transparent dark:from-sky-300 dark:to-purple-300">
          Pomsly
        </span>
        {/* Co-Work with others */}
      </h1>
      <p className="text-md text-slate-300 sm:text-xl">
        A live Co-working Platform to enhance your productivity, colaboratively
        or independently.
      </p>
    </div>
  );
};

export default Header;
