import React, { useCallback } from 'react'
import Button from 'react-bootstrap/Button';
import './addbutton.css'


export const AddButton = ({
    labelText, handleOnclick,
    ...rest
}) => (
        <Button
            variant="contained"
            className="add-btn btn btn-primary"
            onClick={handleOnclick}>
            <i class="fas fa-plus"></i>
            <span className ="btn_space"></span>
            {labelText}
        </Button>
    );