import React from 'react';
import { emphasize, withStyles } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Chip from '@material-ui/core/Chip';
import HomeIcon from '@material-ui/icons/Home';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Link from '@material-ui/core/Link';
import { Link as RouterLink, Route, BrowserRouter as Router } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';

const LinkRouter = props => <Link {...props} component={RouterLink} />;


const StyledBreadcrumb = withStyles(theme => ({
    root: {
        backgroundColor: theme.palette.grey[100],
        height: theme.spacing(3),
        color: theme.palette.grey[800],
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover, &:focus': {
            backgroundColor: theme.palette.grey[300],
        },
        '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(theme.palette.grey[300], 0.12),
        },
    },
}))(Chip);

export default function CustomBreadcrumbs() {
    return <Route>
        {({ location }) => {
            const pathnames = location.pathname.split('/').filter(x => x);
            return (
                <Breadcrumbs aria-label="Breadcrumb">
                    <RouterLink color="inherit" to="/">
                        Home
                     </RouterLink>
                    {pathnames.map((value, index) => {
                        const last = index === pathnames.length - 1;
                        const to = `/${pathnames.slice(0, index + 1).join('/')}`;

                        return last ? (
                            <Typography color="textPrimary" key={to}>
                                {value}
                            </Typography>
                        ) : (
                                <RouterLink color="inherit" to={to} key={to}>
                                    {value}
                                </RouterLink>
                            );
                    })}
                </Breadcrumbs>
            );
        }}
    </Route>
}
