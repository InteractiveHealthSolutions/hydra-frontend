import React from 'react'
import { ExpendableList } from '../../../common/expendablelist/ExpendableList'
import FormViewContainer from '../formView/FormViewContainer'
import ListItem from '../../../../ui/listItem/ListItem'
import styles from './componentview.module.css';
const ComponentView = ({ phaseComponents, componentForms, handleOnClick, handleDeleteOnClick, ...props }) => {
    return (
        <>
            {
                (phaseComponents && phaseComponents.length > 0) ? phaseComponents.map((element, index) => (
                    <ExpendableList
                        margin="true"
                        title={element.hydramoduleComponent.name}
                    >
                        <ul className={styles.ul_contaienr} >
                            {
                                (componentForms && componentForms.length > 0) ? componentForms.filter(data => data.component.uuid === element.componentUUID).map((el, index) => (
                                    <ListItem
                                        handleOnClick={handleOnClick}
                                        completed={true}
                                        handleDeleteOnClick={handleDeleteOnClick}
                                        data={el}
                                        view={true}
                                    />
                                )) : null
                            }

                        </ul>
                    </ExpendableList>

                )) : null
            }
        </>
    )
}
export default ComponentView