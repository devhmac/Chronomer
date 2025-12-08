"use client";

import { Plate, usePlateEditor } from "platejs/react";

import { Editor, EditorContainer } from "@/components/ui/editor";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { PlateEditor } from "@/components/editor/plate-editor";

export default function NotePage() {
	// const editor = usePlateEditor(); // Initializes the editor instance
	return (
		<MaxWidthWrapper className="h-screen">
			<div className="border border-black h-screen">
				<PlateEditor />
			</div>
		</MaxWidthWrapper>
	);
}
