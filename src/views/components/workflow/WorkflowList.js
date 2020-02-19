import React, { memo, useState, useEffect, useRef } from 'react';
import Card from '@material-ui/core/Card';

export const useGeneric = (
  list = [],
  handleClick,
  deleteWorkflow,
  ...props
) => {

  const [myitems, setItems] = useState([]);
  const [mylistItems, setListItems] = useState([]);

  function setImgIcon(name) {
    switch (name.toUpperCase()) {
      case 'FACILITY BASED':
        return (
          <img
            className='workflow-icon img-fluid '
            src={require('../../../assets/facilityo.svg')}
            alt=''
          />
        );
      case 'COMMUNITY BASED':
        return (
          <img
            className='workflow-icon img-fluid '
            src={require('../../../assets/communityo.svg')}
            alt=''
          />
        );
      default:
        return (
          <img
            className='workflow-icon img-fluid'
            src={require('../../../assets/workflow.png')}
            alt=''
          />
        );
    }
  }

  function display() {
    console.log('useGeneric List', list);
    if (list.length > 0) {
        
        setItems(list);
        let listItems = list.map(val => (
          <li
            className='block-list-workflow'
            key={val.workflowId}
            data-id={val.workflowId}
            id='2'
          >
            <Card className='wf-Card'>
              <div className='row wf-row'>
                <div
                  className='col-sm-1 col-md-1 col-lg-1 wf-div'
                  onClick={e => handleClick(e, val)}
                >
                  {setImgIcon(val.name)}
                </div>
                <div
                  className='col-sm-10 col-md-10 col-lg-10 wf-div'
                  onClick={e => handleClick(e, val)}
                >
                  <h6 className='list-content' onClick={e => handleClick(e, val)}>
                    {val.name}
                  </h6>
                </div>
                <div className='col-sm-1 col-md-1 col-lg-1'>
                  <span onClick={e => deleteWorkflow(e, val)}>
                    <i className='fas fa-times delete-icon-workflow'></i>
                  </span>
                </div>
              </div>
            </Card>
          </li>
        ));
        setListItems(listItems);
    }
  }

  useEffect(() => {
    display();
    return () => {};
  }, [list]);
  
  return [myitems, mylistItems];
};