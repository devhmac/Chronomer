import React from "react";
import { ThemeToggle } from "../ThemeToggle";
import Link from "next/link";
import Image from "next/image";

const Nav = () => {
  return (
    <nav className="h-15 mt-2 flex h-12 flex-row  items-center justify-between gap-2 px-6 md:px-20">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/assets/logos/logo1_nobg.png"
          alt="Pomsly logo"
          width={47}
          height={47}
          className="rounded"
        />
        <h3 className="text-2xl font-medium">Pomsly</h3>
      </Link>

      <div>
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Nav;
