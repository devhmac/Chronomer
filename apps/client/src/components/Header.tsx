import React from "react";

const Header = () => {
  return (
    <div>
      {/* <section className="mb-6 flex flex-col justify-center text-center"> */}
      <h1 className=" mb-9 mt-4  max-w-[850px] text-4xl font-semibold tracking-[-1.2px] sm:text-7xl sm:leading-[72px]">
        <span className=" bg-gradient-to-tr from-sky-400 to-purple-500 bg-clip-text text-transparent dark:from-sky-300 dark:to-purple-300">
          Chronomer
        </span>{" "}
        - Deep work in parallel with others
        {/* Co-Work with others */}
      </h1>
      <p className="text-md text-slate-600 dark:text-slate-300 sm:text-xl">
        A live Co-working platform to enhance your productivity, independently
        or colaboratively.
      </p>
      {/* </section> */}
    </div>
  );
};

export default Header;
