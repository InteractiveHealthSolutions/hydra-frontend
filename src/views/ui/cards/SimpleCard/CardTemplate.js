import React from 'react'
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import './cardtemplate.css'
import Divider from "@material-ui/core/Divider";
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles({
    card: {
        margin: "auto",
        transition: "0.3s",
        width: "100%",
        height: props => props.height,
    },
    content :{
        padding:props =>props.contentPadding,
        width: "100%"
    },
    divider: {
        margin: '4px'
    },
    heading: {
        fontWeight: "bold"
    },
    subheading: {
        lineHeight: 1.8
    }

});

export default function CardTemplate(props) {
    const classes = useStyles(props);

    const { title, action, subTitle, children } = props
    return (
        <Card className={classes.card}>
            <CardHeader
                title={title}
                subheader={subTitle ? subTitle : ""}
                action={action ? action : ""}
            />
            <Divider className={classes.divider} light />
            <CardContent className={classes.content}  >
                {children}
            </CardContent>
        </Card >
    )
}
