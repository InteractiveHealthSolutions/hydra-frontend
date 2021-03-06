import React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import {ComponentViewContainer} from '../../components/patient/dataView'
import './tabpanel.css'

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        height: props => props.height
    },
}));

export default function WorkflowTabPanel({ tabData, tabPanelData, ...props }) {
    const classes = useStyles(props);
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = index => {
        setValue(index);
    };
    const a11yProps = (index) => {
        return {
            id: `full-width-tab-${index}`,
            'aria-controls': `full-width-tabpanel-${index}`,
        };
    }

    return (
        <div className={classes.root}>
            <AppBar position="static" color="inherit">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                >
                    {
                        tabData ?
                            tabData.map((element, index) => (
                                <Tab label={element.phaseName}  {...a11yProps(index)} />
                            ))
                            : null
                    }
                    {/* <Tab label="Search"  {...a11yProps(0)} />
                    <Tab label="Treat" {...a11yProps(1)} />
                    <Tab label="Prevent" {...a11yProps(1)} /> */}
                </Tabs>
            </AppBar>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}
            >
                {
                    tabPanelData ?
                        tabPanelData.map((element, index) => (
                            <TabPanel value={value} index={index} dir={theme.direction}>
                               <ComponentViewContainer
                                 phaseUuid ={element.phaseUUID}
                               />
                            </TabPanel>
                        ))
                        : null

                }
                {/* <TabPanel value={value} index={0} dir={theme.direction}>
                    {searchTab}
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                    {treatTab}
                </TabPanel>
                <TabPanel value={value} index={2} dir={theme.direction}>
                    {preventTab}
                </TabPanel> */}
            </SwipeableViews>
        </div>
    );
}