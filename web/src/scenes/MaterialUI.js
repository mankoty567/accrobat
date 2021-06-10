import { makeStyles } from '@material-ui/core/styles';

let useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: theme.mixins.toolbar,
  content: {
    width: '35%',
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(2),
    position: 'relative',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  mapContainer: {
    border: '0.5px solid black',
    width: 'auto',
    height: '60vh',
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
  actionButtons: {
    marginTop: theme.spacing(2),
  },
}));

export default useStyles;
