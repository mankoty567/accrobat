import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import './markdowEditorStyle.scss';
import {
  IconButton,
  MenuItem,
  Paper,
  Grid,
  Select,
  Typography,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from '@material-ui/core';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined';
import StrikethroughSIcon from '@material-ui/icons/StrikethroughS';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import FormatQuoteIcon from '@material-ui/icons/FormatQuote';
import RemoveIcon from '@material-ui/icons/Remove';
import ImageIcon from '@material-ui/icons/Image';
import Image from '@tiptap/extension-image';

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const [imageDialog, setImageDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleDialogClose = () => {
    setImageUrl('');
    setImageDialog(false);
  };

  return (
    <div
      style={{
        width: '100%',
        borderStyle: 'solid',
        borderRadius: '3px',
        borderWidth: '1px',
        paddingBottom: '5px',
        paddingTop: '10px',
        paddingLeft: '10px',
      }}
    >
      <Grid container item>
        <Grid container item direction="column" xs={5}>
          <Grid item>
            <Typography>Formatage de texte :</Typography>
          </Grid>
          <Grid item>
            <Tooltip title="Mettre en gras">
              <IconButton
                onClick={() =>
                  editor.chain().focus().toggleBold().run()
                }
                className={editor.isActive('bold') ? 'is-active' : ''}
              >
                <FormatBoldIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Souligner">
              <IconButton
                onClick={() =>
                  editor.chain().focus().toggleUnderline().run()
                }
                className={editor.isActive('bold') ? 'is-active' : ''}
              >
                <FormatUnderlinedIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Mettre en italique">
              <IconButton
                onClick={() =>
                  editor.chain().focus().toggleItalic().run()
                }
                className={
                  editor.isActive('italic') ? 'is-active' : ''
                }
              >
                <FormatItalicIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Barrer">
              <IconButton
                onClick={() =>
                  editor.chain().focus().toggleStrike().run()
                }
                className={
                  editor.isActive('strike') ? 'is-active' : ''
                }
              >
                <StrikethroughSIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
        <Grid container direction="column" item space={0} xs={2}>
          <Grid item>
            <Typography>Type de texte :</Typography>
          </Grid>
          <Grid item>
            <Select
              onChange={(e) => {
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
              defaultValue={0}
            >
              <MenuItem value={0}>Normal</MenuItem>
              <MenuItem value={1}>Titre 1</MenuItem>
              <MenuItem value={2}>Titre 2</MenuItem>
              <MenuItem value={3}>Titre 3</MenuItem>
              <MenuItem value={4}>Titre 4</MenuItem>
              <MenuItem value={5}>Titre 5</MenuItem>
              <MenuItem value={6}>Titre 6</MenuItem>
            </Select>
          </Grid>
        </Grid>
        <Grid container direction="column" item xs={5}>
          <Grid item>
            <Typography>Structuration de texte :</Typography>
          </Grid>
          <Grid item>
            <Tooltip title="Insérer une liste de points">
              <IconButton
                onClick={() =>
                  editor.chain().focus().toggleBulletList().run()
                }
                className={
                  editor.isActive('bulletList') ? 'is-active' : ''
                }
              >
                <FormatListBulletedIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Insérer une liste numérotée">
              <IconButton
                onClick={() =>
                  editor.chain().focus().toggleOrderedList().run()
                }
                className={
                  editor.isActive('orderedList') ? 'is-active' : ''
                }
              >
                <FormatListNumberedIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Insérer une citation">
              <IconButton
                onClick={() =>
                  editor.chain().focus().toggleBlockquote().run()
                }
                className={
                  editor.isActive('blockquote') ? 'is-active' : ''
                }
              >
                <FormatQuoteIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Insérer une barre horizontale">
              <IconButton
                onClick={() =>
                  editor.chain().focus().setHorizontalRule().run()
                }
              >
                <RemoveIcon />
              </IconButton>
            </Tooltip>

            <IconButton
              onClick={() => {
                setImageDialog(true);
              }}
            >
              <ImageIcon />
            </IconButton>

            <Dialog
              open={imageDialog}
              onClose={() => setImageDialog(false)}
            >
              <DialogTitle>Ajouter une image via url</DialogTitle>
              <DialogContent>
                <TextField
                  label="Url de l'image :"
                  helperText="Veuillez entrer une url de votre image"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                ></TextField>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => handleDialogClose()}>
                  Annuler
                </Button>

                <Button
                  onClick={() => {
                    editor
                      .chain()
                      .focus()
                      .setImage({ src: imageUrl })
                      .run();
                    handleDialogClose();
                  }}
                >
                  Valider
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default ({ callback, defaultText }) => {
  const editor = useEditor({
    onUpdate({ editor }) {
      callback(editor.getHTML());
    },
    extensions: [StarterKit, Underline, Image],
    content: defaultText,
  });

  return (
    <div
      style={{
        height: '100%',
      }}
    >
      <Paper
        style={{
          height: '100%',
        }}
      >
        <MenuBar editor={editor} />
        <EditorContent
          editor={editor}
          style={{
            width: '100%',
            padding: '5px',
          }}
        ></EditorContent>
      </Paper>
    </div>
  );
};
