import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import LoaderButton from '../../components/LoaderButton/LoaderButton';
import { Auth } from 'aws-amplify';

export default class Login extends Component {
  state = {
    isLoading: false,
    email: '',
    password: '',
    alertError: ''
  };

  validateForm() {
    const { email, password } = this.state;
    return email.length > 0 && password.length > 5;
  }

  handleChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  };

  handleSubmit = async event => {
    event.preventDefault();
    this.setState({ isLoading: true });
    try {
      await Auth.signIn(this.state.email, this.state.password);
      this.props.userHasAuthenticated(true);
      this.props.history.push('/dashboard');
    } catch (e) {
      this.setState({ isLoading: false, alertError: e.message });
    }
  };

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
    const { isLoading, email, password, alertError } = this.state;
    return (
      <div className='Login'>
        <Row>
          <Col md={{ span: 4, offset: 4 }}>
            {alertError !== '' && this.renderAlert()}
            <Form onSubmit={this.handleSubmit}>
              <Form.Group controlId='email'>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  autoFocus
                  type='email'
                  size='lg'
                  autoComplete='username'
                  value={email}
                  onChange={this.handleChange}
                />
              </Form.Group>
              <Form.Group controlId='password'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type='password'
                  size='lg'
                  autoComplete='current-password'
                  value={password}
                  onChange={this.handleChange}
                />
              </Form.Group>
              <LoaderButton
                variant='primary'
                size='lg'
                disabled={!this.validateForm()}
                type='submit'
                isLoading={isLoading}
                text='Login'
                loadingText='Loggin in...'
              />
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}
