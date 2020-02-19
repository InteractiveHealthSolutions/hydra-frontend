import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import './checkbox.css';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing(3),
  },
}));

export default function CheckboxesGroup() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    gilad: true,
    jason: false,
    antoine: false,
  });

  const handleChange = name => event => {
    setState({ ...state, [name]: event.target.checked });
  };

  const { gilad, jason, antoine } = state;
  const error = [gilad, jason, antoine].filter(v => v).length !== 2;

  return (
    <div className={classes.root}>
      <FormControl component="fieldset" className={classes.formControl}>
       <FormLabel component="legend" >Event Type</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={gilad} onChange={handleChange('gilad')} value="gilad" />}
            label="Karongi visit"
          />
          <FormControlLabel
            control={<Checkbox checked={jason} onChange={handleChange('jason')} value="jason" />}
            label="Karongi visit"
          />
          <FormControlLabel
            control={
              <Checkbox checked={antoine} onChange={handleChange('antoine')} value="antoine" />
            }
            label="Karongi visit"
          />
        </FormGroup>
      </FormControl>
    </div>
  );
}