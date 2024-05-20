import React from "react";

const Header = () => {
  return (
    <div className="max-w-[950px]">
      {/* <section className="mb-6 flex flex-col justify-center text-center"> */}
      <h1 className=" main-header-text mb-9  mt-4 ">
        <span className=" bg-gradient-to-tr from-sky-400 to-purple-500 bg-clip-text text-transparent dark:from-sky-300 dark:to-purple-300">
          Elevate
        </span>{" "}
        {/* Co-Work with others */}
        Your Focus through Parallel Productivity
      </h1>
      <p className="landing-sub-text text-wrap">
        {/* A live Co-working platform centered around shared focus timers. Enhance
        your productivity individually, or motivate yourself with others.  */}
        Join live co-working spaces with synchronized focus timers. Boost
        effectiveness, track task progress, and stay motivated alongside others.
      </p>
      {/* </section> */}
    </div>
  );
};

export default Header;
