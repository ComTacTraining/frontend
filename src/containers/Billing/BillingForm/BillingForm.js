import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import { CardElement, injectStripe } from 'react-stripe-elements';
import LoaderButton from '../../../components/LoaderButton/LoaderButton';
import './BillingForm.css';

class BillingForm extends Component {
  state = {
    name: '',
    isProcessing: false,
    isCardComplete: false
  };

  validateForm() {
    const { name, isCardComplete } = this.state;
    return name !== '' && isCardComplete;
  }

  handleFieldChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  };

  handleCardFieldChange = event => {
    this.setState({ isCardComplete: event.complete });
  };

  handleSubmitClick = async event => {
    event.preventDefault();
    const { name } = this.state;
    this.setState({ isProcessing: true });
    const { token, error } = await this.props.stripe.createToken({ name });
    this.setState({ isProcessing: false });
    this.props.onSubmit(name, { token, error });
  };

  render() {
    const { isProcessing, name } = this.state;
    const loading = isProcessing || this.props.loading;

    return (
      <Form className='BillingForm' onSubmit={this.handleSubmitClick}>
        <Form.Group controlId='name'>
          <Form.Label>Cardholder&apos;s Name</Form.Label>
          <Form.Control
            autoFocus
            type='text'
            size='lg'
            value={name}
            placeholder='Name on card'
            onChange={this.handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId='card'>
          <Form.Label>Credit Card Info</Form.Label>
          <CardElement
            className='card-field'
            onChange={this.handleCardFieldChange}
            style={{
              base: {
                fontSize: '18px',
                fontFamily: '"Open Sans", sans-serif'
              }
            }}
          />
        </Form.Group>
        <LoaderButton
          variant='primary'
          size='lg'
          disabled={!this.validateForm()}
          type='submit'
          isLoading={loading}
          text='Purchase'
          loadingText='Processing...'
        />
      </Form>
    );
  }
}

export default injectStripe(BillingForm);
