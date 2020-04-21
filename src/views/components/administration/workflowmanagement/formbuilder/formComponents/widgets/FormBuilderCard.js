import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import QuestionConfiguration from './QuestionConfiguration';
import Chip from '@material-ui/core/Chip';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles(theme => ({
  card: {
    marginRight: 10,
    shadowColor: "#000",
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 4,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function FormBuilderCard(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [displayOrder, setDisplayOrder] = useState("");

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  function handleDelete(e) {
    props.handleDelete(e)
  }

  function onItemSelectedProp(ev) {
    setDisplayOrder(ev.value)

  }

  useEffect(() => {
    if (props.data && props.editeMood) {
      editValue()
    }
  }, [])

  function editValue() {
    let dataField = props.data
    localStorage.setItem(`${dataField.uuid}-defaultValue`, dataField.defaultValue ? dataField.defaultValue : "")
    localStorage.setItem(`${dataField.uuid}-errorMsg`, dataField.errorMessage ? dataField.errorMessage : "")
    localStorage.setItem(`${dataField.uuid}-questionText`, dataField.displayText ? dataField.displayText : "")
    localStorage.setItem(`${dataField.uuid}-mandatory`, dataField.mandatory ? dataField.mandatory == true ? "Yes" : "No" : "No")
    localStorage.setItem(`${dataField.uuid}-headingTitle`, dataField.displayText ? dataField.displayText : "")
    localStorage.setItem(`${dataField.uuid}-minValue`, dataField.minValue ? dataField.minValue : "")
    localStorage.setItem(`${dataField.uuid}-maxValue`, dataField.maxValue ? dataField.maxValue : "")
    localStorage.setItem(`${dataField.uuid}-maxLength`, dataField.maxLength ? dataField.maxLength : "")
    localStorage.setItem(`${dataField.uuid}-minLength`, dataField.minLength ? dataField.minLength : "")
    localStorage.setItem(`${dataField.uuid}-scorable`, dataField.scorable ? dataField.scorable : "")
    localStorage.setItem(`${dataField.uuid}-allowCharacter`, dataField.allowCharacter ? dataField.allowCharacter : "")
    localStorage.setItem(`${dataField.uuid}-rxp`, dataField.regix ? dataField.regix : "")
    localStorage.setItem(`${dataField.uuid}-futureDate`, dataField.allowFutureDate ? dataField.allowFutureDate : "")
    localStorage.setItem(`${dataField.uuid}-pastDate`, dataField.allowPastDate ? dataField.allowPastDate : "")
    localStorage.setItem(`${dataField.uuid}-disabled`, dataField.disabled ? dataField.disabled == true ? "Yes" : "No" : "No")
  }

  return (
    <Box
      boxShadow={2}
      bgcolor="background.paper"
      m={1}
      p={1}
      style={{ marginRight: '16px' }}
    >
      <CardHeader
        action={
          <Chip label="Delete" onDelete={() => handleDelete(props.data.uuid)} color="primary" variant="outlined" />
        }
        title={props.data.value}
        subheader={`Data Type : ${props.data.dataType}`}
      />
      {
        (props.data.description) ?
          <CardContent>
            <Typography>{props.data.description}</Typography>
          </CardContent> :
          ""
      }
      <CardActions disableSpacing>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <QuestionConfiguration
            datatype={props.data.dataType}
            data={props.data.answers}
            uuid={props.data.uuid}
            dataField={props.data}
          />
        </CardContent>
      </Collapse>
    </Box>
  );
}
