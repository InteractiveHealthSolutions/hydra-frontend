import React, { Component } from "react";
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';

export class DraggableFormItem extends Component {

  constructor(props) {
    super(props)
    this.state = {
      dataToReturn: {},
    }
  }

  onDragStart = (ev, uuid, controlId) => {
    ev.dataTransfer.setData("comingfrom", controlId)
    ev.dataTransfer.setData('id', uuid)
    this.props.handleNested()
  }
  render() {
    const { data, key, controlId, handleNested } = this.props;
    // var randomColor = Math.floor(Math.random() * 16777215).toString(16);
    // console.log("randomColor", controlId)
    return (
      <li
        key={` ${data.uuid} + ${key}`}
        data-id={data.uuid}
        draggable
        onDragStart={(e) => { this.onDragStart(e, data.uuid, controlId) }}
        style={{ marginBottom: '14px' }}
      >
        <Box
          boxShadow={2}
          bgcolor="background.paper"
          m={1}
          p={1}
          className="boxss"
        >
          <CardHeader
            // avatar={
            //   <Avatar aria-label="recipe" style={{ background: `#${randomColor}` }} >
            //     {data.value.charAt(0).toUpperCase()}
            //   </Avatar>
            // }
            title={data.value}
            subheader={`Data Type : ${data.dataType}`}
            style={{ fontSize: '16px !important' }}
          />
          {/* {
            (data.description) ?
              <CardContent
             
              >
                <Typography >{data.description}</Typography>
              </CardContent> : ""
          } */}
        </Box>
      </li>
    )
  }
}

export default DraggableFormItem;
