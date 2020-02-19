import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { red } from '@material-ui/core/colors';

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

export default function Home(props) {
    const classes = useStyles();
    return (
        <div className="row">
            
            <div className="col-md-4">
                <Card className = {classes.card}>
                    <CardHeader
                        title="Form"
                    />
                    <CardContent>
                    </CardContent>
                </Card>
            </div>
            <div className="col-md-4">
                <Card>
                    <CardHeader
                        title="Question Bank"
                    />
                    <CardContent>
                    </CardContent>
                </Card>
            </div>
            <div className="col-md-4">
                <Card>
                    <CardHeader
                        title="Rule Engine"
                    />
                    <CardContent>
                    </CardContent>
                </Card>
            </div>

        </div>

    )
}
