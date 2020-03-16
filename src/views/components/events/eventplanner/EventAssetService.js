import React, { useEffect, useState } from 'react'
import { ExpendableList } from '../../common/expendablelist/ExpendableList'
import { serviceAction } from '../../../../state/ducks/service';
import { connect } from 'react-redux'
import { LoaderDots } from "../../common/loader/LoaderDots"
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { assetAction } from '../../../../state/ducks/assets';
import { SERVICE_TITLE, ASSETS_TITLE } from '../../../../utilities/constants/globalconstants'
import './eventplanner.css'
import MUIList from '@material-ui/core/List';

const animatedComponents = makeAnimated();

function EventAssetService({ title, assetResult, serviceResult, ...props }) {

    const [serviceData, setServiceData] = useState([])
    const [assetCategory, setassetCategory] = useState([])

    useEffect(() => {
        if (props.serviceList !== undefined && props.serviceList.services !== undefined) {
            asyncService()
        }
    }, [props.serviceList])

    async function asyncService() {
        let serviceArr = await filterByServiceType(props.serviceList.services);
        console.log("serviceArr", serviceArr)
        setServiceData(serviceArr)
    }

    useEffect(() => {
        if (props.assetCategoryList !== undefined && props.assetCategoryList.services !== undefined) {
            setassetCategory(props.assetCategoryList.services)
        }
    }, [props.assetCategoryList, assetCategory])


    useEffect(() => {
        if (title === SERVICE_TITLE) {
            props.getAllService()
        } else if (title === ASSETS_TITLE) {
            props.getAllAssetCategory()
        }

    }, [])


    function listFormate(list) {
        let array = []
        list.services.forEach((data) => {
            array.push(
                {
                    label: (<span>{data.name}</span>),
                    value: data.uuid
                }
            )
        })
        return array
    }


    function assetListFormate(list) {
        let array = []

        if (list.assetTypes !== undefined) {
            list.assetTypes.forEach((data, index) => {
                data.assets.forEach((assetData) => {
                    array.push(
                        {
                            label: (<span>{assetData.name}<span className="category">({data.name})</span></span>),
                            value: assetData.uuid
                        }
                    )
                })
            })
        }
        return array
    }


    async function filterByServiceType(list) {
        let uuidTypeArray = await [...new Set(list.map(item => item.serviceType.name))]
        let arr = await uuidTypeArray.map((data, index) => {
            let filterService = list.filter(serviceItem => serviceItem.serviceType.name === data)
            return { name: data, services: filterService }
        })
        return arr
    }

    function changeHandle() {

    }

    if (props.isLoading) return <LoaderDots height={30} width={30} />;
    return (
        <ExpendableList title={title}>
            <MUIList className="mui_list">
                {
                    (title === SERVICE_TITLE) ?
                        serviceData.map((data, index) => (
                            <ExpendableList
                                margin="true"
                                title={data.name}>
                                <Select
                                    key={data.name.trim()}
                                    isSearchable="true"
                                    parent={data.name}
                                    className="asset-list"
                                    components={animatedComponents}
                                    options={listFormate(data)}
                                    onChange={(e) => serviceResult(e,data.name.trim())}
                                    isMulti />
                            </ExpendableList>
                        ))
                        :
                        assetCategory.map(data => (
                            <ExpendableList margin="true" title={data.name}>
                                <Select
                                    key={data.name.trim()}
                                    className="asset-list"
                                    components={animatedComponents}
                                    options={assetListFormate(data)}
                                    onChange={(e) => assetResult(e,data.name.trim()) }
                                    isMulti />
                            </ExpendableList>
                        ))
                }
            </MUIList>
        </ExpendableList>
    )
}

const mapStateToProps = state => ({
    serviceList: state.service.services,
    isLoading: state.service.loading,
    assetCategoryList: state.asset.assetCategory,
});

const mapDispatchToProps = {
    getAllService: serviceAction.fetchServices,
    getAllAssetCategory: assetAction.fetchAssetCategory
};

export default connect(mapStateToProps, mapDispatchToProps)(EventAssetService);
