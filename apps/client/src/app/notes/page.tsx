"use client";

import { Plate, usePlateEditor } from "platejs/react";

import { Editor, EditorContainer } from "@/components/ui/editor";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

export default function NotePage() {
	const editor = usePlateEditor(); // Initializes the editor instance
	return (
		<MaxWidthWrapper className="h-screen">
			<div className="border border-black h-screen">
				Notes Screen
				<Plate editor={editor}>
					{/* Provides editor context */}
					<EditorContainer className="h-full border border-black">
						{/* Styles the editor area */}
						<Editor placeholder="Type your amazing content here..." />
					</EditorContainer>
				</Plate>{" "}
			</div>
		</MaxWidthWrapper>
	);
}
