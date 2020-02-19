import React, { useState, useEffect } from 'react'

import Assets from './assets/Assets'
import Services from './services/Services'
import Workforce from './workforce/Workforce'

function EventManagement() {

    return (
        <>
            <Assets></Assets>
            <Services></Services>
            <Workforce></Workforce>
        </>
    )
}

export default EventManagement
