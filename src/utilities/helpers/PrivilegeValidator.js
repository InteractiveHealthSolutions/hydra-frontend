
import {
    ACCESS_ADMINISTRATION,
    MANAGE_EVENTS,
    MANAGE_EVENTS_METADATA,
    MANAGE_WORKFLOWS,
    MANAGE_WORKFLOWS_METADATA,
    VIEW_DASHBOARD,
    VIEW_REPORTS
} from '../constants/globalconstants'

import { createNotification } from './helper'

export const privilegeValidate = value => {
    if (value.match.path === '/workflow') {
        return filterPrivilege(MANAGE_WORKFLOWS)
    } else if (value.match.path === '/administration') {
        return filterPrivilege(ACCESS_ADMINISTRATION)
    } else if (value.match.path === '/events') {
        return filterPrivilege(MANAGE_EVENTS)
    }
    else if (value.match.path === '/reports') {
        return filterPrivilege(VIEW_REPORTS)
    } else {
        return true
    }
}

const filterPrivilege = (privilegeName) => {
    let userPrivileges = JSON.parse(localStorage.getItem('active_user'))
    let privilege = userPrivileges.filter(data => data.name === privilegeName)
    console.log("privilegeValidate", privilege)
    if (privilege.length > 0) {
        return true
    } else {
        return false
    }
}

export const RequirePrivilege = (props) => {
    console.log("RequirePrivilege", props)

    if (props === '/event/metadata') {
        return filterPrivilege(MANAGE_EVENTS_METADATA)
    }
    else if (props === '/workflow/metadata') {
        return filterPrivilege(MANAGE_WORKFLOWS_METADATA)
    }
    else if (props === '/administration') {
        return filterPrivilege(ACCESS_ADMINISTRATION)
    }
    else if (props === '/events') {
        return filterPrivilege(MANAGE_EVENTS)
    }
    else if (props === '/reports') {
        return filterPrivilege(VIEW_REPORTS)
    }
    else if (props === '/workflow') {
        return filterPrivilege(MANAGE_WORKFLOWS)
    }
}

