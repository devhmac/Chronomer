"use client";

import { AutoformatKit } from "./autoformat-kit";
import { BasicBlocksKit } from "./basic-blocks-kit";
import { BasicMarksKit } from "./basic-marks-kit";
import { DndKit } from "./dnd-kit";
import { MarkdownKit } from "./markdown-kit";

export const EditorKits = [
  ...BasicBlocksKit,
  ...BasicMarksKit,
  ...DndKit,
  ...MarkdownKit,
  ...AutoformatKit,
];
