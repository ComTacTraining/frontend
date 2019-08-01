import React, { Component } from 'react';
import { Auth } from 'aws-amplify';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import LoaderButton from '../../components/LoaderButton/LoaderButton';
import './Register.css';

export default class Register extends Component {
  state = {
    isLoading: false,
    email: '',
    password: '',
    confirmPassword: '',
    confirmationCode: '',
    newUser: null,
    alertError: ''
  };

  validateForm() {
    const { email, password, confirmPassword } = this.state;
    return (
      email.length > 0 && password.length > 5 && password === confirmPassword
    );
  }

  validateConfirmationForm() {
    const { confirmationCode } = this.state;
    return confirmationCode.length > 0;
  }

  handleChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  };

  handleSubmit = async event => {
    const { email, password } = this.state;
    event.preventDefault();
    this.setState({ isLoading: true });
    try {
      const newUser = await Auth.signUp({
        username: email,
        password: password
      });
      this.setState({ newUser, isLoading: false });
    } catch (e) {
      this.setState({ isLoading: false, alertError: e.message });
    }
  };

  handleConfirmationSubmit = async event => {
    const { email, password, confirmationCode } = this.state;
    event.preventDefault();
    this.setState({ isLoading: true });
    try {
      await Auth.confirmSignUp(email, confirmationCode);
      await Auth.signIn(email, password);
      this.props.userHasAuthenticated(true);
      this.props.history.push('/profile');
    } catch (e) {
      this.setState({ isLoading: false, alertError: e.message });
    }
  };

  renderConfirmationForm() {
    const { isLoading, confirmationCode } = this.state;
    return (
      <Form onSubmit={this.handleConfirmationSubmit}>
        <Form.Group controlId='confirmationCode'>
          <Form.Label>Confirmation Code</Form.Label>
          <Form.Control
            autoFocus
            type='tel'
            size='lg'
            value={confirmationCode}
            onChange={this.handleChange}
          />
          <Form.Text className='text-muted'>
            Please check your email for the code.
          </Form.Text>
        </Form.Group>
        <LoaderButton
          variant='primary'
          size='lg'
          disabled={!this.validateConfirmationForm()}
          type='submit'
          isLoading={isLoading}
          text='Verify'
          loadingText='Verifying...'
        />
      </Form>
    );
  }

  renderForm() {
    const { isLoading, email, password, confirmPassword } = this.state;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Group controlId='email'>
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            type='email'
            size='lg'
            autoComplete='email'
            value={email}
            onChange={this.handleChange}
          />
        </Form.Group>
        <Form.Group controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            size='lg'
            autoComplete='new-password'
            value={password}
            onChange={this.handleChange}
          />
        </Form.Group>
        <Form.Group controlId='confirmPassword'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            size='lg'
            autoComplete='new-password'
            value={confirmPassword}
            onChange={this.handleChange}
          />
        </Form.Group>
        <LoaderButton
          variant='primary'
          size='lg'
          disabled={!this.validateForm()}
          type='submit'
          isLoading={isLoading}
          text='Register'
          loadingText='Registering...'
        />
      </Form>
    );
  }

  handleDismissAlert = () => {
    this.setState({ alertError: '' });
  };

  renderAlert() {
    const { alertError } = this.state;
    return (
      <Alert variant='danger' onClose={this.handleDismissAlert} dismissible>
        <Alert.Heading>Error</Alert.Heading>
        <p>{alertError}</p>
      </Alert>
    );
  }

  render() {
    const { newUser, alertError } = this.state;
    return (
      <div className='Register'>
        <Row>
          <Col md={{ span: 4, offset: 4 }}>
            {alertError !== '' && this.renderAlert()}
            {newUser === null
              ? this.renderForm()
              : this.renderConfirmationForm()}
          </Col>
        </Row>
      </div>
    );
  }
}
