import React from 'react';
import { FormBuilder } from 'react-formio';

class FormRender extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div >
                <FormBuilder form={{ display: 'form' }} onChange={(schema) => console.log(schema)} />
           </div>

        )
    }
}

export default FormRender

