import React from "react";

const Header = () => {
  return (
    <section className="mb-6 text-center">
      <h1 className="sm:leading-[72px mb-4 mt-4 max-w-3xl text-5xl font-semibold tracking-[-1.2px] sm:text-7xl">
        {" "}
        <span className=" bg-gradient-to-tr from-sky-400 to-purple-500 bg-clip-text text-transparent dark:from-sky-300 dark:to-purple-300">
          Cronomer
        </span>{" "}
        - Focus with others in parallel
        {/* Co-Work with others */}
      </h1>
      <p className="text-md text-slate-300 sm:text-xl">
        A live Co-working platform to enhance your productivity, colaboratively
        or independently.
      </p>
    </section>
  );
};

export default Header;
