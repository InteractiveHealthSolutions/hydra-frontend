import React from 'react';

class ButtonRenderer extends React.Component {

    constructor(props) {
        super(props);
        
    }


    render() {
        let button;
        console.log('btn ' + this.props.data.testsample)
        if (this.props.colDef.headerName == "View Attribute Types")
            button = <button style={{ height: 20, lineHeight: 0.5 }} className='btn btn-primary' >View</button>
        else if (this.props.colDef.headerName == "Add Attribute Types")
            button = <button style={{ height: 20, lineHeight: 0.5 }} className='btn btn-success' >Add</button>
        else if (this.props.colDef.headerName == "View")
            button = <button style={{ lineHeight: 0.5, color: "#808080" }}><i class="fas fa-eye "></i></button>
        else if (this.props.colDef.headerName == "Edit")
            button = <button style={{ lineHeight: 0.5, color: "#808080" }}><i class="fas fa-edit "></i></button>
        else if (this.props.colDef.headerName == "Test Results")
            button = <button style={{ lineHeight: 0.5 }}><img className="testresult-icon img-fluid" src={require('../../assets/testresult.png')} /></button>
        else if (this.props.colDef.headerName == "Manage Test Sample" && this.props.data.testsample == '')
            button = <button style={{ lineHeight: 0.5, marginLeft: '60px', color: "#808080" }}><i class="fas fa-vials"></i></button>
        else if (this.props.colDef.headerName == "Manage Test Sample" && this.props.data.testsample == 'ACCEPTED')
            button = <button style={{ lineHeight: 0.5, marginLeft: '60px', color: "green" }}><i class="fas fa-vials"></i></button>
            else if(this.props.colDef.headerName == "Manage Test Sample" && this.props.data.testsample == 'REJECTED')
            button = <button style={{lineHeight:0.5 , marginLeft:'60px',color:"red"}}><i class="fas fa-vials"></i></button>
            else if(this.props.colDef.headerName == "Manage Test Sample" && this.props.data.testsample == 'PROCESSED')
            button = <button style={{lineHeight:0.5 , marginLeft:'60px',color:"blue"}}><i class="fas fa-vials"></i></button>
         
        else if (this.props.colDef.headerName == "Accept Sample")
            button = <button style={{ lineHeight: 0.5, marginLeft: '20px', color: "green" }}><i class="fas fa-check"></i></button>
        else if (this.props.colDef.headerName == "Reject Sample")
            button = <button style={{ lineHeight: 0.5, marginLeft: '20px', color: "red" }}><i class="fas fa-times"></i></button>

        return (
            <span>
                {button}
            </span>
        );
    }
}

export default ButtonRenderer;