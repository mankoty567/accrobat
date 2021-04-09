import { makeStyles } from '@material-ui/core/styles';

//Du style CSS de Material ui
const drawerWidth = 240;

let useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    width: '100%',
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
  margin_top: {
    marginTop: theme.spacing(4),
  },
  modal_test: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper_test: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default useStyles;
