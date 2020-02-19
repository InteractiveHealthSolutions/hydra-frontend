import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(0.5),
        },
    },
}));


export default function ChipView(props) {
    const classes = useStyles();

    function handleDelete(e, data) {
        props.handleDelete(e, data)
    }

    return (
        <div className={classes.root}>
            {
                (props.ruleActionList) ?
                    props.ruleActionList.map(data => (
                        <>
                            <Chip
                                label={data.label}
                                onDelete={() => { }}
                                color="primary"
                                variant="outlined"
                                onDelete={(e) => handleDelete(e, data)}
                            />
                        </>
                    ))
                    : ""
            }
        </div>
    )
}
