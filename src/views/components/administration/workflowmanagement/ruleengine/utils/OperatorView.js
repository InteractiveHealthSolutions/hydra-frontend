import React from 'react'

//not applied yet ,.
export default function OperatorView(props) {
    return (
        <> {
            (props.operatorList) ?
                props.operatorList.map(data => (
                    <button
                        className='btn btn-primary control-btn'
                        onClick={this.handleOperator(data)}
                        draggable
                        onDragStart={(e) => this.onDragStart(e, data)}
                    >{data.label}</button>
                ))
                : ""
        }
        </>
    )
}
