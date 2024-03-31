import { Timer } from "@/components/Timer";

import { TodoTable } from "@/components/table/TodoTable";
import Image from "next/image";
import Header from "@/components/Header";
import { Butterfly_Kids } from "next/font/google";
import { Button } from "@/components/ui/button";
import LandingLayout from "@/components/LandingLayout";

export default function Home() {
  return (
    <main className="p-10 text-center">
      <LandingLayout />
    </main>
  );
}
