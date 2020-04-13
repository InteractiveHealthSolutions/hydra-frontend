import React from 'react'
import ListItem from '../../../../ui/listItem/ListItem'

const FormView = ({ componentForms, componentUUID, handleOnClick, handleDeleteOnClick }) => {

    return (
        <
        >
            {
                (componentForms && componentForms.length > 0) ? componentForms.map((element, index) => (
                    <li
                        key={componentUUID +"-"+index}
                    >
                        {element.form.name}
                    </li>
                )) : <p>empty</p>
            }
        </>
    )
}

export default FormView