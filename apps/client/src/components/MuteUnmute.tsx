import React, { Dispatch, SetStateAction, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

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
      className="mb-0 align-bottom"
      variant="ghost"
      size="sm"
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
