import { makeStyles } from '@material-ui/core/styles';

let useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: theme.mixins.toolbar,
  content: {
    height: '100vh',
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(2),
  },
  mapContainer: {
    border: '0.5px solid black',
    height: '100%',
  },
  margin_top: {
    marginTop: theme.spacing(4),
  },
  modifyModal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modifyPaper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  input: {
    backgroundColor: theme.palette.background.paper,
    width: '100%',
  },
}));

export default useStyles;
