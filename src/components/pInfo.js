import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import  { Form, Button } from 'react-bootstrap';

function pInfo() {
    return (
        <div>
             <div className="formBorder">
          <Form>
          <Form.Label>Patient Registration Form</Form.Label>

          <Form.Group controlId="formBasicEmail">
            <Form.Control type="email" placeholder="Email" />
          </Form.Group>

          <Form.Group controlId="formName">
            <Form.Control type="text" placeholder="Name" />
          </Form.Group>

          <Form.Group controlId="formBlood">
            <Form.Control type="text" placeholder="Blood Group" />
          </Form.Group>

          {['radio'].map(type => (
            <div key={`inline-${type}`} className="mb-3">
              <Form.Check inline label="Female" type={type} id={`inline-${type}-1`} />
              <Form.Check inline label="Male" type={type} id={`inline-${type}-2`} />
              <Form.Check inline label="Other" type={type} id={`inline-${type}-3`} />
            </div>
          ))}

          <Form.Group controlId="formNumber">
            <Form.Control type="Number" placeholder="Phone number" />
          </Form.Group>

          <Form.Group controlId="formAddress">
            <Form.Control type="text" placeholder="Address" />
          </Form.Group>
          <Form.Group controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="I agree to save my details over Ethereum Blockchain Network" />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
    </div>
            </div>
      );
}

export default pInfo;