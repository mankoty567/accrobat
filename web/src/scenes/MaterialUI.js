import { makeStyles } from '@material-ui/core/styles';

let useStyles = makeStyles((theme) => ({
  root: {
    // display: 'flex',
  },
  appBar: {
    width: '70%',
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    width: '40%',
    height: '70%',
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(2),
    position: 'relative',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  mapContainer: {
    width: 'auto',
    height: '85%',
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
    position: 'relative',
    left: '50%',
    marginTop: theme.spacing(7),
    transform: 'translate(-50%, -50%)',
    display: 'inline-block',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    zIndex: 999,
    position: 'absolute',
    marginTop: 10,
    marginRight: 10,
  },
}));

export default useStyles;
