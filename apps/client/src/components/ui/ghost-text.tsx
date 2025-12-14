"use client";

import { useElement, usePluginOption } from "platejs/react";

export function GhostText() {
  const element = useElement();

  // const isSuggested = usePluginOption(
  //   CopilotPlugin,
  //   "isSuggested",
  //   element.id as string,
  // );
  const isSuggested = null;

  if (!isSuggested) return null;
  // if (!isSuggested) return null;

  return <GhostTextContent />;
}

function GhostTextContent() {
  // const suggestionText = usePluginOption(CopilotPlugin, "suggestionText");
  const suggestionText = null;

  return (
    <span
      className="text-muted-foreground/70 pointer-events-none max-sm:hidden"
      contentEditable={false}
    >
      {suggestionText && suggestionText}
    </span>
  );
}
