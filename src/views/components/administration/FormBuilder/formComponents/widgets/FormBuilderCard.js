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

const useStyles = makeStyles(theme => ({
  card: {
    // maxWidth: 345,
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
    console.log("display order is set")
    //localStorage.setItem(`${ev.name}`, ev.value)
  }
  
  return (
    <Card className={classes.card}>
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
          />
        </CardContent>
      </Collapse>
    </Card>
  );
}
