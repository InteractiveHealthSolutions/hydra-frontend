import React from 'react'
import Select from 'react-select';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import './expendablelist.css'
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

export const ExpendableList = ({ 
    title,
    children,
    margin
}) =>(
        <ExpansionPanel className={margin?"expansion_margin" : "ep-expansion"}>
            <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <span className="icon-padding" ><i class="fas fa-poll-h gradient"></i></span>
                <Typography >{title}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails >
               {children}
            </ExpansionPanelDetails>
        </ExpansionPanel>
    )
