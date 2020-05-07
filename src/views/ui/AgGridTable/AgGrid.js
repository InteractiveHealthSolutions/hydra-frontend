import React from 'react'
import { AgGridReact } from '@ag-grid-community/react';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";
import "@ag-grid-community/all-modules/dist/styles/ag-theme-material.css";
// import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
// import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css';
// import '@ag-grid-community/all-modules/dist/styles/ag-theme-blue.css';
import './aggrid.css'

export const AgGrid = ({
    columnDefs,
    onRowSelected,
    rowData,
    onCellClicked,
    onGridReady,
    height,
    handleCellEditingStopped,
    rowClassRules
}) => (
        <div className="d-flex justify-content-center ">
            <div
                className="ag-theme-material"
                style={{
                    height: height ? height : '460px',
                    width: '100%',
                    margin: 'auto'
                }}
            >
                {/* floatingFilter={true} */}
                <AgGridReact
                    onGridReady={onGridReady}
                    columnDefs={columnDefs}
                    rowData={rowData}
                    modules={AllCommunityModules}
                    onRowSelected={onRowSelected}
                    onCellClicked={event => { onCellClicked(event) }}
                    onCellEditingStopped={event => {handleCellEditingStopped(event)}}
                    enableSorting
                    enableFilter
                    rowAnimation
                    enableRangeSelection={true}
                    pagination={true}
                    paginationAutoPageSize={true}
                    isExternalFilterPresent={true}
                    enableColResize="true"
                    rowClassRules={rowClassRules}
                >
                </AgGridReact>
            </div>
        </div>
    )

