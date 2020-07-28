import React, { Component } from 'react';
import './App.css';

class Form extends Component {
    render() {
        let form = (
            <div>
                <div>
                    {this.props.children}
                </div>
            </div>
        );

        if (!this.props.isopen && !this.props.isenter) {
            form = null;
        }
        return (
            <div>
                {form}
            </div>
        );
    }
}

export default Form;