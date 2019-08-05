import React, { Component, Fragment } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import LoaderButton from '../../components/LoaderButton/LoaderButton';
import { API } from 'aws-amplify';

export default class Profile extends Component {
  state = {
    isLoading: false,
    isLoadingAlarms: true,
    isUpdating: false,
    alarms: false,
    alarm1: '',
    alarm2: '',
    alarm3: '',
    dispatchCenter: ''
  };

  async componentDidMount() {
    try {
      const data = await this.getAlarms();
      this.setState({
        alarms: true,
        alarm1: data.alarm1,
        alarm2: data.alarm2,
        alarm3: data.alarm3,
        dispatchCenter: data.dispatchCenter,
        isLoadingAlarms: false
      });
    } catch (e) {
      this.setState({ isLoadingAlarms: false });
    }
  }

  validateForm() {
    const { alarm1, alarm2, alarm3, dispatchCenter } = this.state;
    return (
      alarm1.length > 0 &&
      alarm2.length > 0 &&
      alarm3.length > 0 &&
      dispatchCenter.length > 0
    );
  }

  handleChange = event => {
    this.setState({ [event.target.id]: event.target.value });
  };

  handleSubmit = async event => {
    const { alarm1, alarm2, alarm3, dispatchCenter, isUpdating } = this.state;
    event.preventDefault();
    this.setState({ isLoading: true });
    try {
      const data = {
        alarm1: alarm1,
        alarm2: alarm2,
        alarm3: alarm3,
        dispatchCenter: dispatchCenter
      };
      if (isUpdating) {
        await this.updateAlarms(data);
      } else {
        await this.createAlarms(data);
      }
      this.setState({ isLoading: false, isUpdating: false, alarms: data });
    } catch (e) {
      this.setState({ isLoading: false });
    }
  };

  handleUpdateRequest = () => {
    this.setState({ isUpdating: true });
  };

  createAlarms(data) {
    return API.post('comtac', '/alarms', {
      body: data
    });
  }

  updateAlarms(data) {
    return API.put('comtac', '/alarms', {
      body: data
    });
  }

  getAlarms() {
    return API.get('comtac', '/alarms');
  }

  renderForm() {
    const { isLoading, alarm1, alarm2, alarm3, dispatchCenter } = this.state;
    return (
      <Fragment>
        <p>Personalize your alarms by separating them with commas.</p>
        <Form onSubmit={this.handleSubmit}>
          <Form.Group controlId='alarm1'>
            <Form.Label>First Alarm</Form.Label>
            <Form.Control
              autoFocus
              type='text'
              size='lg'
              value={alarm1}
              placeholder='Engine 11, Truck 12, Chief 13'
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Group controlId='alarm2'>
            <Form.Label>Second Alarm</Form.Label>
            <Form.Control
              type='text'
              size='lg'
              value={alarm2}
              placeholder='Engine 21, Truck 22, Chief 23'
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Group controlId='alarm3'>
            <Form.Label>Third Alarm</Form.Label>
            <Form.Control
              type='text'
              size='lg'
              value={alarm3}
              placeholder='Engine 31, Truck 32, Chief 33'
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Group controlId='dispatchCenter'>
            <Form.Label>Dispatch Center</Form.Label>
            <Form.Control
              type='text'
              size='lg'
              value={dispatchCenter}
              placeholder='Dispatch Center Name'
              onChange={this.handleChange}
            />
          </Form.Group>
          <LoaderButton
            variant='primary'
            size='lg'
            disabled={!this.validateForm()}
            type='submit'
            isLoading={isLoading}
            text='Submit'
            loadingText='Saving...'
          />
        </Form>
      </Fragment>
    );
  }

  renderAlarms() {
    const { alarm1, alarm2, alarm3, dispatchCenter } = this.state;
    return (
      <Fragment>
        <Button variant='dark' size='sm' onClick={this.handleUpdateRequest}>
          Edit
        </Button>
        <ListGroup>
          <ListGroup.Item>
            <strong>First Alarm:</strong> {alarm1}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Second Alarm:</strong> {alarm2}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Third Alarm:</strong> {alarm3}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Dispatch Center:</strong> {dispatchCenter}
          </ListGroup.Item>
        </ListGroup>
      </Fragment>
    );
  }

  render() {
    const { isLoadingAlarms, alarms, isUpdating } = this.state;
    return (
      !isLoadingAlarms && (
        <div className='Profile'>
          <Row>
            <Col md={{ span: 8, offset: 2 }}>
              <h1>Profile</h1>
              {!alarms || isUpdating ? this.renderForm() : this.renderAlarms()}
            </Col>
          </Row>
        </div>
      )
    );
  }
}
