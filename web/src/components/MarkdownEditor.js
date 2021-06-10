import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import './markdowEditorStyle.scss';
import {
  Button,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Select,
} from '@material-ui/core';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined';
import StrikethroughSIcon from '@material-ui/icons/StrikethroughS';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import FormatQuoteIcon from '@material-ui/icons/FormatQuote';
import RemoveIcon from '@material-ui/icons/Remove';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <>
      <IconButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        <FormatBoldIcon />
      </IconButton>
      <IconButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        <FormatUnderlinedIcon />
      </IconButton>
      <IconButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        <FormatItalicIcon />
      </IconButton>
      <IconButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'is-active' : ''}
      >
        <StrikethroughSIcon />
      </IconButton>

      <Select
        onChange={(e) => {
          console.log(e.target.value);
          if (e.target.value === 0) {
            editor.chain().focus().clearNodes().run();
          } else {
            editor
              .chain()
              .focus()
              .toggleHeading({ level: e.target.value })
              .run();
          }
        }}
      >
        <MenuItem value={0}>Normal</MenuItem>
        <MenuItem value={1}>Titre 1</MenuItem>
        <MenuItem value={2}>Titre 2</MenuItem>
        <MenuItem value={3}>Titre 3</MenuItem>
        <MenuItem value={4}>Titre 4</MenuItem>
        <MenuItem value={5}>Titre 5</MenuItem>
        <MenuItem value={6}>Titre 6</MenuItem>
      </Select>

      <IconButton
        onClick={() =>
          editor.chain().focus().toggleBulletList().run()
        }
        className={editor.isActive('bulletList') ? 'is-active' : ''}
      >
        <FormatListBulletedIcon />
      </IconButton>

      <IconButton
        onClick={() =>
          editor.chain().focus().toggleOrderedList().run()
        }
        className={editor.isActive('orderedList') ? 'is-active' : ''}
      >
        <FormatListNumberedIcon />
      </IconButton>

      <IconButton
        onClick={() =>
          editor.chain().focus().toggleBlockquote().run()
        }
        className={editor.isActive('blockquote') ? 'is-active' : ''}
      >
        <FormatQuoteIcon />
      </IconButton>
      <IconButton
        onClick={() =>
          editor.chain().focus().setHorizontalRule().run()
        }
      >
        <RemoveIcon />
      </IconButton>

      <IconButton onClick={() => editor.chain().focus().undo().run()}>
        <UndoIcon />
      </IconButton>
      <IconButton onClick={() => editor.chain().focus().redo().run()}>
        <RedoIcon />
      </IconButton>
    </>
  );
};

export default ({ callback }) => {
  const editor = useEditor({
    onUpdate({ editor }) {
      callback(editor.getHTML());
    },
    extensions: [StarterKit, Underline],
    content: '',
  });

  return (
    <div>
      <Paper style={{ padding: '15px' }}>
        <MenuBar editor={editor} />
        <Divider />

        <EditorContent editor={editor} />
        {/*<Button onClick={() => console.log(editor.getHTML())}>
          Test
  </Button>*/}
      </Paper>
    </div>
  );
};
