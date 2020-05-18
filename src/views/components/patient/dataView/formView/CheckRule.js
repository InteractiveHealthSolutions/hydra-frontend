import React, { useState, useEffect } from 'react'
import { sExpressionParser } from './SepressionParser'

export default function CheckRule({
    rule,
    children,
    values,
    type
}) {

  
    const [visible, setVisible] = useState(true)
    useEffect(() => {
    
        if (rule !== null) {
            checkCondition()
        }
    })
    async function checkCondition() {
            let isHide = await sExpressionParser(rule,values,type)
            setVisible(isHide)
}

    ///this function must be generalized. hide and show . autoselect 
    return (
        <>
            {
                visible ? <> {children} </> : null
            }
        </>
    )
}
