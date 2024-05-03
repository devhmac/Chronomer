import React, { Dispatch, SetStateAction, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

import { useTimer } from "@/lib/hooks/useTimer";
import { Button } from "./ui/button";

const MuteUnmute = ({
  isMuted,
  setIsMuted,
}: {
  isMuted: boolean;
  setIsMuted: Dispatch<SetStateAction<boolean>>;
}) => {
  // const [muted, setMuted] = useState(false);

  return (
    <Button
      className="mb-0"
      variant="ghost"
      size="icon"
      onClick={() => setIsMuted((prev) => !prev)}
    >
      {isMuted ? (
        <VolumeX className="h-5 w-5" />
      ) : (
        <Volume2 className="h-5 w-5" />
      )}
    </Button>
  );
};

export default MuteUnmute;
