import React, { useState } from 'react';
import {
  AppBar,
  Tabs,
  Tab,
  Typography,
  Toolbar,
  IconButton,
  Avatar,
  MenuItem,
  ClickAwayListener,
  Popper,
  Grow,
  Paper,
  MenuList,
} from '@material-ui/core';
import { Link, useLocation } from 'react-router-dom';
import { API } from '../eventApi/api';
import { useRecoilState } from 'recoil';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

/**
 * La barre de navigation du site, utilisable partout
 */
export const Navbar = () => {
  let location = useLocation();

  const [page, setPage] = useState(
    '/' + location.pathname.split('/')[1],
  );
  const [userState] = useRecoilState(API.user.userAtom);

  /**
   * En cas de changement de valeurs
   * @param {any} event Evenement actuel, non utilisé
   * @param {String} value L'url de la page courante
   */
  const handleChanges = (event, value) => {
    setPage(value);
  };

  //Variable pour le menu
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target)
    ) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <AppBar position="static">
      <Toolbar>
        <Tabs value={page} onChange={handleChanges}>
          <Tab
            label="Accueil"
            component={Link}
            to="/home"
            value="/home"
          />

          {userState ? (
            <Tab
              label="Vos challenges"
              component={Link}
              to="/challenges"
              value="/challenges"
            />
          ) : null}

          {/* {userState ? (
            <Tab
              label="Tous les challenges"
              component={Link}
              to="/inscriptions"
              value="/inscriptions"
            />
          ) : null} */}

          {userState && userState.permission > 99 ? (
            <Tab
              label="Administration"
              component={Link}
              value="/admin"
              style={{ color: '#9c1809' }}
              to="/admin/editor"
            />
          ) : null}

          {!userState ? (
            <Tab
              label="Se connecter"
              component={Link}
              to="/login"
              value="/login"
            />
          ) : null}
        </Tabs>
        <Typography
          variant="h3"
          style={{
            flexGrow: '1',
            textAlign: 'center',
          }}
        >
          Run's Like
        </Typography>

        {userState ? (
          <div
            style={{
              marginLeft: 'auto',
              marginRight: '0',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <IconButton
              onClick={(e) => handleToggle(e)}
              ref={anchorRef}
            >
              <Avatar
                style={{ marginRight: '5px' }}
                src={`https://api.acrobat.bigaston.dev/api/user/${userState.id}/avatar`}
              ></Avatar>
              <Typography
                variant="h6"
                color="secondary"
                style={{ marginRight: '5px' }}
              >
                {userState.username}
              </Typography>
              <KeyboardArrowDownIcon color="secondary" />
            </IconButton>
            <Popper
              open={open}
              anchorEl={anchorRef.current}
              role={undefined}
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === 'bottom'
                        ? 'center top'
                        : 'center bottom',
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList
                        autoFocusItem={open}
                        id="menu-list-grow"
                        onKeyDown={handleListKeyDown}
                      >
                        <MenuItem
                          component={Link}
                          to="/profile"
                          onClick={handleClose}
                        >
                          Gérer mon profil
                        </MenuItem>
                        <MenuItem
                          component={Link}
                          to="/logout"
                          onClick={handleClose}
                        >
                          Se déconnecter
                        </MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </div>
        ) : null}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
