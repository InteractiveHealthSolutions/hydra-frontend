
import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import Icon from '@material-ui/core/Icon';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import { questionAction } from '../../../../../../state/ducks/questions';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    nested: {
        paddingLeft: theme.spacing(4),
        marginLeft: 52
    },
    icon: {
        fontSize: 12
    },
}));

export default function QuestionListExpendableView(props) {

    const [availableForm, setAvailableForm] = useState([])
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const [expanded, setExpanded] = React.useState(false);

    useEffect(() => {
        if (props.form !== undefined && props.form.formFields) {

            setAvailableForm(props.form)
            props.form.formFields.forEach(element => {
                element.isOpen = false
            });
            console.log("questionList form", props.form.formFields)
        }
    }, [props.form, availableForm])


    function handleAddQuestion(val) {
        console.log("handleAddQuestion", val)
        props.handleAddQuestion(val)
    }

    function handleAddQuestionAnswer(e, val) {
        console.log("handleAddQuestionAnswer", val)
        props.handleAddQuestionAnswer(val)
    }

    const handleExpandClick = (e, data) => {
        data.isOpen = !data.isOpen
        setExpanded(!data.isOpen);
    };
    const handleClick = (e, val) => {
        e.preventDefault()
        props.handleAddQuestion(val)
    };

    return (
        <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
                <ListSubheader component="div" id="nested-list-subheader" style={{ fontWeight: 'bold' }}>
                    {availableForm.name}
                </ListSubheader>
            }
            className={classes.root}
        >
            <div style={{ height: '300px', overflowY: 'auto' }}>
                {
                    (availableForm.formFields) ?
                        availableForm.formFields.map((question, index) => (

                            (question.field) ?
                                <>
                                    <ListItem button>
                                        <ListItemIcon onClick={e => handleClick(e, question.field)}>
                                            <Icon className="fas fa-question-circle" style={{ marginLeft: '8px', fontSize: '22px' }} />
                                        </ListItemIcon>
                                        <ListItemText primary={question.displayText?question.displayText:question.field.name} onClick={e => handleClick(e, question.field)} />
                                        {(question.field.answers.length > 0) ?
                                            <IconButton
                                                className={clsx(classes.expand, {
                                                    [classes.expandOpen]: question.isOpen,
                                                })}
                                                onClick={e => handleExpandClick(e, question)}
                                                aria-expanded={question.isOpen}
                                                aria-label="show more"
                                            >
                                                <ExpandMoreIcon />
                                            </IconButton>
                                            : ""
                                        }
                                    </ListItem>
                                    {(question.field.answers) ?
                                        question.field.answers.map(answer => (
                                            <Collapse in={question.isOpen} timeout="auto" unmountOnExit>
                                                <List button onClick={e => handleAddQuestionAnswer(e, answer.concept)} disablePadding>
                                                    <ListItem button className={classes.nested}>
                                                        <ListItemIcon>
                                                            <Icon className="fas fa-plus" style={{ fontSize: '16px', marginLeft: '8px' }} />
                                                        </ListItemIcon>
                                                        <ListItemText primary={answer.concept.display} />
                                                    </ListItem>
                                                </List>
                                            </Collapse>
                                        ))
                                        : ""
                                    }
                                    <Divider variant="inset" component="li" />
                                </>
                                : ""))
                        : ""
                }
            </div>

        </List>
    );
}
