import React, { Component } from 'react'
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DraggableFormItem from './DraggableFormItem';
import './widgets.css'


export default class DefaultExpendable extends Component {

    constructor(props) {
        super(props)
        this.state = {

        }
    }
    render() {
        const { title, data, controlId } = this.props
        return (
            <ul className="ul_form" >
                {data.map((item, index) => {
                    return (
                        <DraggableFormItem
                            controlId="default"
                            key={index}
                            data={item}
                        />
                    )
                })}
            </ul>
            //     <ExpansionPanel style ={{marginBottom:'16px'}}>
            //         <ExpansionPanelSummary
            //             expandIcon={<ExpandMoreIcon />}
            //             aria-controls="panel1a-content"
            //             id="panel1a-header"
            //         >
            //             <Typography >{title}</Typography>
            //         </ExpansionPanelSummary>
            //         <ExpansionPanelDetails>
            //             <ul style={{ height: '500px', width: '100%', overflowY: 'scroll' }} >
            //                 {data.map((item, index) => {
            //                     return (
            //                         <DraggableFormItem
            //                             controlId="default"
            //                             key={index}
            //                             data={item}
            //                         />
            //                     )
            //                 })}
            //             </ul>
            //         </ExpansionPanelDetails>
            //     </ExpansionPanel>
            // )
        )
    }
}
