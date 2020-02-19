import React, { Component } from 'react'
import FormDetail from './detail/FormDetail'
import FormBuilder from './create/FormBuilder'

export default class FormHome extends Component {

    constructor(props) {
        super(props)
        this.state = {
            status: "Home",
            step: 1,
        }
    }
    nextStep = async () => {
        const { step } = this.state
        this.setState({
            step: step + 1
        })
    }
    prevStep = () => {
        const { step } = this.state
        this.setState({
            step: step - 1
        })
    }

    handleChange = input => e => {
        this.setState({ [input]: e.target.value })
    }

    render() {
        const { step } = this.state
        switch (step) {
            case 1:
                return (
                    <FormDetail
                        nextStep={this.nextStep}
                        handleChange={this.handleChange}
                    />
                )
            case 2:
                return (
                    <FormBuilder
                        prevStep={this.prevStep}
                    />
                )
        }

    }
}
