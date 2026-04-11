"use client";

import {
  BaseBoxShapeUtil,
  HTMLContainer,
  T,
  TLBaseShape,
} from "tldraw";

type NoteCardShapeProps = {
  w: number;
  h: number;
  blockId: string;
  title: string;
  preview: string;
  tags: string[];
};

export type NoteCardShape = TLBaseShape<"note-card", NoteCardShapeProps>;

export const noteCardShapeProps = {
  w: T.number,
  h: T.number,
  blockId: T.string,
  title: T.string,
  preview: T.string,
  tags: T.arrayOf(T.string),
};

export class NoteCardShapeUtil extends BaseBoxShapeUtil<NoteCardShape> {
  static override type = "note-card" as const;
  static override props = noteCardShapeProps;

  override canResize() {
    return true;
  }

  override getDefaultProps(): NoteCardShape["props"] {
    return {
      w: 280,
      h: 160,
      blockId: "",
      title: "Untitled",
      preview: "",
      tags: [],
    };
  }

  override component(shape: NoteCardShape) {
    const { title, preview, tags } = shape.props;

    return (
      <HTMLContainer>
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "8px",
            border: "1px solid rgba(255,255,255,0.1)",
            backgroundColor: "rgba(30, 30, 40, 0.95)",
            padding: "14px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            overflow: "hidden",
            fontFamily: "var(--font-geist-sans, system-ui, sans-serif)",
            color: "rgba(255,255,255,0.9)",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              fontWeight: 600,
              lineHeight: "1.3",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </div>

          {preview && (
            <div
              style={{
                fontSize: "12px",
                color: "rgba(255,255,255,0.55)",
                lineHeight: "1.5",
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                flex: 1,
              }}
            >
              {preview}
            </div>
          )}

          {tags.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "4px",
                marginTop: "auto",
              }}
            >
              {tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: "10px",
                    fontWeight: 500,
                    padding: "2px 8px",
                    borderRadius: "9999px",
                    backgroundColor: "rgba(139, 92, 246, 0.15)",
                    color: "rgba(167, 139, 250, 0.9)",
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </HTMLContainer>
    );
  }

  override indicator(shape: NoteCardShape) {
    return (
      <rect
        width={shape.props.w}
        height={shape.props.h}
        rx="8"
        ry="8"
      />
    );
  }
}
