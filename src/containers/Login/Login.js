import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import LoaderButton from '../../components/LoaderButton/LoaderButton';
import { Auth } from 'aws-amplify';

export default class Login extends Component {
  state = {
    isLoading: false,
    email: '',
    password: ''
  };

  validateForm() {
    const { email, password } = this.state;
    return email.length > 0 && password.length > 0;
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
    } catch (e) {
      alert(e.message);
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { isLoading, email, password } = this.state;
    return (
      <div className='Login'>
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
      </div>
    );
  }
}
