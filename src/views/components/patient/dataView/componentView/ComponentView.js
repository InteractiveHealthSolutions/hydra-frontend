import React from 'react'
import { ExpendableList } from '../../../common/expendablelist/ExpendableList'
import FormViewContainer from '../formView/FormViewContainer'
import ListItem from '../../../../ui/listItem/ListItem'
import styles from './componentview.module.css';
import { LoaderDots } from '../../../common/loader/LoaderDots'

const ComponentView =
    ({ phaseComponents,
        componentForms,
        handleOnClick,
        handleDeleteOnClick,
        ...props }) => (
            <>
                {
                    (phaseComponents && phaseComponents.length > 0) ? phaseComponents.map((element, index) => (
                        <ExpendableList
                            margin="true"
                            title={element.hydramoduleComponent.name}
                        >
                            {
                                componentForms && componentForms.length > 0 ?
                                    <ul className={styles.ul_contaienr} >
                                        {
                                            componentForms.filter(data => data.component.uuid === element.componentUUID).map((el, index) => (
                                                <ListItem
                                                    handleOnClick={handleOnClick}
                                                    completed={true}
                                                    handleDeleteOnClick={handleDeleteOnClick}
                                                    data={el}
                                                    view={true}
                                                />
                                            ))
                                        }
                                    </ul>
                                    : <LoaderDots withMargin="true" height={40} width={40} />
                            }
                        </ExpendableList>

                    )) : null
                }
            </>
        )

export default ComponentView