import React, { useEffect, useState } from 'react'
import { questionAction } from '../../../../../state/ducks/questions'
import { AgGridReact } from '@ag-grid-community/react';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-balham.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';

function QuestionListModal(props) {

    const [columnDefs, setColumnDefs] = useState([
        {
            headerName: "Name", field: "name", width: 300
        },
        {
            headerName: "Data Type", field: "concept.datatype.display", width: 150
        }
    ]);
    const [rowData, setRowData] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');

    useEffect(() => {
        if (props.questionList !== undefined) {
            setRowData(props.questionList.results)
        }
    }, [props.questionList])

    useEffect(() => {
        getAllFormQuestions();
    }, []);

    async function getAllFormQuestions() {
        await props.getAllQuestion();
    }

    function onRowSelected(form) {
        console.log('onRowSelected: ' + form.node.data);
    };

    function onCellClicked(form) {
        console.log('onRowSelected: ' + form.node.data);
    };

    function closeModal() {
        props.closeModal();
    }

    return (
        <Modal
            show={props.openModal}
            onHide={() => closeModal()}
            style={{ marginTop: '100px' }}
        >
            <Modal.Header closeButton>
                <Modal.Title>{modalTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ overflowY: 'auto' }} >
                <div
                    className="ag-theme-balham"
                    style={{
                        height: '321px',
                        width: '100%'
                    }}
                >
                    <AgGridReact
                        columnDefs={columnDefs}
                        rowData={rowData}
                        modules={AllCommunityModules}
                        onRowSelected={onRowSelected}
                        onCellClicked={form => { onCellClicked(form) }}
                        enableSorting
                        enableFilter
                        rowAnimation
                        enableRangeSelection={true}
                        pagination={true}
                        paginationAutoPageSize={true}
                        isExternalFilterPresent={true}
                        enableColResize="true"
                    >
                    </AgGridReact>
                </div>
            </Modal.Body>
            <Modal.Footer>
            </Modal.Footer>
        </Modal>
    )
}

const mapStateToProps = state => ({
    questionList: state.questions.questions
});

const mapDispatchToProps = {
    getAllQuestion: questionAction.getAllQuestion
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionListModal) 
