import React, { Component } from "react";
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

export class DraggableFormItem extends Component {

  state = {
    dataToReturn: {},
  }
  onDragStart = (ev, uuid, controlId) => {
    console.log("onDrag start", uuid)
    ev.dataTransfer.setData("comingfrom", controlId)
    ev.dataTransfer.setData('id', uuid)
  }
  render() {
    const { data, key, controlId } = this.props;
    return (
      <li
        key={` ${data.uuid} + ${key}`}
        data-id={data.uuid}
        draggable
        onDragStart={(e) => this.onDragStart(e, data.uuid, controlId)}
        style={{ marginBottom: '14px' }}
      >
        <Box
          boxShadow={2}
          bgcolor="background.paper"
          m={1}
          p={1}
          style={{ marginRight: '12px' }}
        >
          <CardHeader
            title={data.value}
            subheader={`Data Type : ${data.dataType}`}
            style={{ fontSize: '16px !important' }}
          />
          {
            (data.description) ?
              <CardContent>
                <Typography>{data.description}</Typography>
              </CardContent> : ""
          }
        </Box>
      </li>
    )
  }
}

export default DraggableFormItem;
