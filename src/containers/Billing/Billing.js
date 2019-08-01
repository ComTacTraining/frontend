import React, { Component, Fragment } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import LoaderButton from '../../components/LoaderButton/LoaderButton';
import { Auth, API } from 'aws-amplify';
import { Elements, StripeProvider } from 'react-stripe-elements';
import BillingForm from './BillingForm/BillingForm';
import config from '../../config';
import { formatUSD, nextBill } from '../../utils/formatNumbers';

export default class Billing extends Component {
  state = {
    isLoading: false,
    isLoadingProducts: true,
    products: [],
    plans: [],
    email: '',
    subscription: null,
    alertHeading: '',
    alertVariant: '',
    alertMessage: '',
    alertRedirect: '',
    alertRedirectMessage: '',
    showAlert: false
  };

  async componentDidMount() {
    try {
      const products = await this.getProducts();
      const plans = await this.getPlans();
      const session = await Auth.currentSession();
      const subscription = await this.getSubscription();
      this.setState({
        products: products,
        plans: plans,
        email: session.idToken.payload.email,
        isLoadingProducts: false,
        subscription: subscription
      });
    } catch (e) {
      this.setState({ isLoadingProducts: false });
    }
  }

  getSubscription() {
    return API.get('comtac', '/billing/subscription');
  }

  getProducts() {
    return API.get('comtac', '/billing/products');
  }

  getPlans() {
    return API.get('comtac', '/billing/plans');
  }

  createCustomer(details) {
    return API.post('comtac', '/billing/customers', {
      body: details
    });
  }

  createSubscription(details) {
    return API.post('comtac', '/billing/subscriptions', {
      body: details
    });
  }

  cancelSubscription() {
    const { subscription } = this.state;
    const details = { subscriptionId: subscription.subscriptionId };
    return API.post('comtac', '/billing/cancel', {
      body: details
    });
  }

  handleFormSubmit = async (name, { token, error }) => {
    const { plans, email } = this.state;
    if (error) {
      this.setState({
        alertHeading: 'Error',
        alertVariant: 'danger',
        alertMessage: error,
        alertRedirect: '',
        alertRedirectMessage: '',
        showAlert: true
      });
      return;
    }

    this.setState({ isLoading: true });

    try {
      const customer = await this.createCustomer({
        source: token.id,
        name: name,
        email: email
      });
      await this.createSubscription({
        customerId: customer.id,
        planId: plans[0].id
      });
      const subscription = await this.getSubscription();
      const canceled = false;
      this.props.setMemberType(canceled);
      this.setState({
        alertHeading: 'Success',
        alertVariant: 'success',
        alertMessage: 'Your subscription has been successfully been created.',
        alertRedirect: '/dashboard',
        alertRedirectMessage: 'Dashboard',
        showAlert: true,
        isLoading: false,
        subscription: subscription
      });
    } catch (e) {
      this.setState({
        alertHeading: 'Error',
        alertVariant: 'danger',
        alertMessage: e.message,
        alertRedirect: '',
        alertRedirectMessage: '',
        showAlert: true,
        isLoading: false
      });
    }
  };

  handleCancelSubscription = async event => {
    this.setState({ isCanceling: true });
    await this.cancelSubscription();
    const canceled = true;
    this.props.setMemberType(canceled);
    this.setState({
      alertHeading: 'Success',
      alertVariant: 'success',
      alertMessage: 'Your subscription has been successfully been canceled.',
      alertRedirect: '/profile',
      alertRedirectMessage: 'Profile',
      showAlert: true,
      isCanceling: false,
      subscription: null
    });
  };

  handleAlertRedirect = () => {
    const { alertRedirect } = this.state;
    this.props.history.push(alertRedirect);
  };

  handleDismissAlert = () => {
    this.setState({
      alertHeading: '',
      alertVariant: '',
      alertMessage: '',
      alertRedirect: '',
      alertRedirectMessage: '',
      showAlert: false
    });
  };

  renderAlert() {
    const {
      alertHeading,
      alertVariant,
      alertMessage,
      alertRedirect,
      alertRedirectMessage,
      showAlert
    } = this.state;
    return (
      <Fragment>
        {showAlert && (
          <Alert
            variant={alertVariant}
            onClose={this.handleDismissAlert}
            dismissible
          >
            <Alert.Heading>{alertHeading}</Alert.Heading>
            <p>{alertMessage}</p>
            {alertRedirect !== '' && (
              <Fragment>
                <hr />
                <div className='d-flex justify-content-end'>
                  <Button
                    onClick={this.handleAlertRedirect}
                    variant={`outline-${alertVariant}`}
                  >
                    {alertRedirectMessage}
                  </Button>
                </div>
              </Fragment>
            )}
          </Alert>
        )}
      </Fragment>
    );
  }

  renderNextBill() {
    const { subscription, isCanceling } = this.state;
    const currentPeriodEnd = subscription.stripe.current_period_end;
    const days = nextBill(currentPeriodEnd);

    return (
      <Fragment>
        <Card.Text>
          Next payment in {days} day
          {days !== 1 ? 's' : ''}
        </Card.Text>
        <LoaderButton
          variant='danger'
          size='sm'
          type='button'
          isLoading={isCanceling}
          text='Cancel'
          loadingText='Canceling...'
          onClick={this.handleCancelSubscription}
        />
      </Fragment>
    );
  }

  render() {
    const {
      isLoading,
      isLoadingProducts,
      products,
      plans,
      subscription,
      alertHeading
    } = this.state;
    return !isLoadingProducts ? (
      <div className='Billing'>
        <Row>
          <Col md={{ span: 8, offset: 2 }}>
            <h1>Billing</h1>
            {alertHeading !== '' ? this.renderAlert() : ''}
            <Card style={{ width: '18rem' }}>
              {plans.map((plan, key) => {
                return (
                  <Card.Body key={key}>
                    <Card.Title>{products[0].name}</Card.Title>
                    <Card.Subtitle className='mb-2 text-muted'>
                      {formatUSD(plan.amount)} / {plan.interval}
                    </Card.Subtitle>
                    {subscription !== null &&
                      !subscription.canceled &&
                      this.renderNextBill()}
                  </Card.Body>
                );
              })}
            </Card>
            {subscription === null ||
              (subscription.canceled && (
                <StripeProvider apiKey={config.STRIPE_KEY}>
                  <Elements>
                    <BillingForm
                      loading={isLoading}
                      onSubmit={this.handleFormSubmit}
                    />
                  </Elements>
                </StripeProvider>
              ))}
          </Col>
        </Row>
      </div>
    ) : (
      <Spinner animation='border' role='status'>
        <span className='sr-only'>Loading...</span>
      </Spinner>
    );
  }
}
