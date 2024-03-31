import { Timer } from "@/components/Timer";

import { TodoTable } from "@/components/table/TodoTable";
import Image from "next/image";
import Header from "@/components/Header";
import { Butterfly_Kids } from "next/font/google";
import { Button } from "@/components/ui/button";
import LandingLayout from "@/components/LandingLayout";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

export default function Home() {
  return (
    <main>
      <LandingLayout />
    </main>
  );
}
