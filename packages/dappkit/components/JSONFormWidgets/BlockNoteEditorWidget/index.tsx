"use client";
import "@blocknote/core/style.css";
import { BlockNoteEditor, BlockSchema, DefaultBlockSchema, defaultBlockSchema, defaultProps } from "@blocknote/core";
import { BlockNoteView, InlineContent, ReactSlashMenuItem, createReactBlockSpec, defaultReactSlashMenuItems, useBlockNote } from "@blocknote/react";
import { WidgetProps } from '@rjsf/utils';
import { useEffect, useRef, useState } from 'react';
import { _ } from '@/dappkit/lib/lodash';
import { helper } from "@/dappkit/lib/helper";
import { ImagePlus } from "lucide-react";

type Options = {
  initialContent?: string;
};

export interface BlockNoteEditorWidgetProps extends WidgetProps {
  options: Options;
}

export interface BlockNoteEditorWidgetUIOptions {
  'ui:widget': (props: BlockNoteEditorWidgetProps) => JSX.Element;
  'ui:options': Options;
}


export default function BlockNoteEditorWidget({ onChange, options = {} }: BlockNoteEditorWidgetProps) {
  const { initialContent } = options;

  const changeContentRef = useRef(
    _.debounce((topLevelBlocks) => {
      const content = JSON.stringify(topLevelBlocks);
      onChange(content);
    }, 800),
  );

  const { ImageBlock, insertImage } = useCustomImageBlock();

  const editor = useBlockNote({
    theme: "dark",
    editorDOMAttributes: {
      class: "min-h-[300px] max-h-[600px] overflow-y-auto"
    },
    initialContent: initialContent ? helper.json.safeParse(initialContent) : undefined,
    blockSchema: {
      // Adds all default blocks.
      ...defaultBlockSchema,
      // Adds the custom image block.
      image: ImageBlock,
    },
    slashCommands: [...defaultReactSlashMenuItems, insertImage],
    onEditorContentChange: (editor) => {
      changeContentRef.current && changeContentRef.current(editor.topLevelBlocks);
    },
  });

  return (
    <BlockNoteView editor={editor} />
  );
}

export const BlockNoteViewBox = ({ content }: { content: string }) => {
  const [editor, setEditor] = useState<BlockNoteEditor<BlockSchema> | null>(null);
  const { ImageBlock, insertImage } = useCustomImageBlock();
  useEffect(() => {
    if (content) {
      editor?._tiptapEditor.destroy();
      const instance = new BlockNoteEditor({
        editable: false,
        theme: "light",
        editorDOMAttributes: {
          class: "dark:text-white",
          style: "padding-inline: 20px; background-color: transparent;"
        },
        blockSchema: {
          // Adds all default blocks.
          ...defaultBlockSchema,
          // Adds the custom image block.
          image: ImageBlock,
        },
        slashCommands: [...defaultReactSlashMenuItems, insertImage],
        initialContent: helper.json.safeParse(content),
      });
      setEditor(instance);
    }
    return () => {
      editor?._tiptapEditor.destroy();
      setEditor(null)
    }
  }, [content]);

  return (
    <BlockNoteView editor={editor} />
  )
}


function useCustomImageBlock() {
  // Creates a custom image block.
  const ImageBlock = createReactBlockSpec({
    type: "image",
    propSchema: {
      ...defaultProps,
      src: {
        default: "https://via.placeholder.com/1000",
      },
    },
    containsInlineContent: true,
    render: ({ block }) => (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}>
        <img
          style={{
            width: "100%",
          }}
          src={block.props.src}
          alt={"Image"}
          contentEditable={false}
        />
        <InlineContent />
      </div>
    ),
  });

  // Creates a slash menu item for inserting an image block.
  const insertImage = new ReactSlashMenuItem<
    DefaultBlockSchema & { image: typeof ImageBlock }
  >(
    "Insert Image",
    (editor) => {
      const src: string | null = prompt("Enter image URL");
      editor.insertBlocks(
        [
          {
            type: "image",
            props: {
              src: src || "https://via.placeholder.com/1000",
            },
          },
        ],
        editor.getTextCursorPosition().block,
        "after"
      );
    },
    ["image", "img", "picture", "media"],
    "Media",
    <ImagePlus />,
    "Insert an image"
  );

  return {
    ImageBlock,
    insertImage
  }
}
