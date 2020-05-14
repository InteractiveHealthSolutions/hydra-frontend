import React, { useState, useEffect } from 'react'
import { sExpressionParser } from './SepressionParser'

export default function CheckRule({
    rule,
    children
}) {
    const [visible, setVisible] = useState(true)
    useEffect(() => {
        if (rule !== null) {
            async function checkCondition() {
                console.log("sExpressionParser ", sExpressionParser(rule))
                let isHide = await sExpressionParser(rule)
                setVisible(isHide)
            }
            checkCondition()
        }
    }, [])

    ///this function must be generalized. hide and show . autoselect 
    return (
        <>
            {
                visible ? <> {children} </> : null
            }
        </>
    )
}
