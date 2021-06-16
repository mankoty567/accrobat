import {
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Grid,
  List,
  ListItem,
  Divider,
  Paper,
} from '@material-ui/core';
import React, { useState } from 'react';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import ReplyIcon from '@material-ui/icons/Reply';
import { API } from '../../eventApi/api';
import CheckIcon from '@material-ui/icons/Check';

/**
 * Page permettant de modifier le mot de passe
 * @param {Function} setMode
 * @param {Function} callback
 */
let PasswordPage = ({ setMode, callback }) => {
  //variable d'interface
  const [password, setPassword] = useState('');
  const [confirmationPass, setConfirmationPass] = useState('');
  const [confirmationPass2, setConfirmationPass2] = useState('');
  const [error, setErr] = useState('');
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword3, setShowPassword3] = useState(false);

  /**
   * Fonction permettant de confirmer la modification du mot de passe
   */
  const handleSubmit = () => {
    API.user
      .editPassword(password, confirmationPass, confirmationPass2)
      .then(() => {
        setMode('profile');
        callback();
      })
      .catch((err) => {
        setErr(err.toString());
      });
  };
  return (
    <div
      style={{
        width: '35vw',
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: '5vh',
      }}
    >
      <Paper>
        <Typography variant="h3">
          Changer son mot de passe :
        </Typography>
        <Divider />
        <List>
          <ListItem>
            <TextField
              fullWidth
              label="Mot de passe actuel :"
              type={showPassword1 ? 'text' : 'password'}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              helperText={
                <Typography color="error">
                  {error === 'Error: Old Password Not Correct'
                    ? 'Mot de passe incorrect'
                    : ''}
                </Typography>
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={(e) =>
                        setShowPassword1(!showPassword1)
                      }
                    >
                      {showPassword1 ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </ListItem>
          <ListItem>
            <TextField
              fullWidth
              label="Nouveau mot de passe :"
              type={showPassword2 ? 'text' : 'password'}
              onChange={(e) => setConfirmationPass(e.target.value)}
              value={confirmationPass}
              helperText={
                <Typography color="error">
                  {error === 'Error: Two password not match'
                    ? 'Les mot de passe sont différent'
                    : ''}
                </Typography>
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={(e) =>
                        setShowPassword2(!showPassword2)
                      }
                    >
                      {showPassword2 ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </ListItem>
          <ListItem>
            <TextField
              fullWidth
              label="Confirmez votre mot de passe :"
              type={showPassword3 ? 'text' : 'password'}
              onChange={(e) => setConfirmationPass2(e.target.value)}
              value={confirmationPass2}
              helperText={
                <Typography color="error">
                  {error === 'Error: Two password not match'
                    ? 'Les mot de passe sont différent'
                    : ''}
                </Typography>
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={(e) =>
                        setShowPassword3(!showPassword3)
                      }
                    >
                      {showPassword3 ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </ListItem>
        </List>
        <Divider />

        <Grid container space={1}>
          <Grid item xs={6}>
            <Button
              fullWidth
              onClick={() => handleSubmit()}
              startIcon={<CheckIcon />}
            >
              Valider
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              onClick={() => setMode('profile')}
              startIcon={<ReplyIcon />}
            >
              Revenir à mon profil
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default PasswordPage;
