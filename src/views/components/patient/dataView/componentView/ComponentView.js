import React from 'react'
import { ExpendableList } from '../../../common/expendablelist/ExpendableList'
import FormViewContainer from '../formView/FormViewContainer'

const ComponentView = ({ phaseComponents, ...props }) => {
    return (
        <>
            {
                (phaseComponents && phaseComponents.length > 0) ? phaseComponents.map((element, index) => (
                    <>   <label style ={{color:"red"}}>{element.hydramoduleComponent.name}</label>
                        <ul
                            key={element.componentUUID}
                        >
                            {
                                phaseComponents.map((el, index) => (
                                    <li
                                      key ={index}
                                    >{el.hydramoduleComponent.name}</li>
                                ))
                            }
                        </ul>
                    </>

                    //    <ExpendableList
                    //         margin="true"
                    //         title={element.hydramoduleComponent.name}
                    //     >
                    //         {
                    //             console.log("element.phaseUUID component" , element.componentUUID)
                    //         }
                    //         <FormViewContainer
                    //             phaseUUID={element.phaseUUID}
                    //             componentUUID={element.componentUUID}
                    //         />
                    //     </ExpendableList>
                )) : null
            }
        </>
    )
}
export default ComponentView