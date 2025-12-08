import React from "react";
import { ThemeToggle } from "../ThemeToggle";
import Link from "next/link";
import Image from "next/image";

const Nav = () => {
  return (
    <nav className="h-15 fixed top-0 z-50 flex w-screen flex-row items-center justify-between  gap-2 bg-popover/50 px-6 py-2 backdrop-blur-sm md:px-20">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/assets/logos/logo1_nobg.png"
          alt="Pomsly logo"
          width={47}
          height={47}
          className="rounded"
        />
        <h3 className="text-2xl font-medium">Chronomer</h3>
      </Link>

      <div>
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Nav;
