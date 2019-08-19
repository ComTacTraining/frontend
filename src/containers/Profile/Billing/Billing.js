import React, { Component, Fragment } from 'react';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import LoaderButton from '../../../components/LoaderButton/LoaderButton';
import { Auth, API } from 'aws-amplify';
import { Elements, StripeProvider } from 'react-stripe-elements';
import BillingForm from './BillingForm/BillingForm';
import config from '../../../config';
//import { formatUSD, nextBill } from '../../../utils/formatNumbers';
import { formatUSD } from '../../../utils/formatNumbers';

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
    showAlert: false,
    showCancelSubscriptionAlert: false
  };

  async componentDidMount() {
    try {
      const products = await this.getProducts();
      const plans = await this.getPlans();
      const session = await Auth.currentSession();
      this.setState({
        products: products,
        plans: plans,
        email: session.idToken.payload.email
      });
      const subscription = await this.getSubscription();
      if (subscription) {
        this.setState({ subscription: subscription });
      }
      this.setState({ isLoadingProducts: false });
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

  handleCancelSubscriptionConfirmation = event => {
    this.setState({
      showCancelSubscriptionAlert: true
    });
  };

  handleDismissCancelSubscriptionAlert = () => {
    this.setState({
      showCancelSubscriptionAlert: false
    });
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
      alertRedirect: '',
      alertRedirectMessage: '',
      showAlert: true,
      isCanceling: false,
      subscription: null,
      showCancelSubscriptionAlert: false
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

  renderCancelSubscriptionAlert() {
    const { isCanceling } = this.state;
    return (
      <Fragment>
        <Alert
          variant='danger'
          onClose={this.handleDismissCancelSubscriptionAlert}
          dismissible
        >
          <Alert.Heading>Are you sure you want to cancel?</Alert.Heading>
          <p>
            You are subscribed using our introductory pricing. If you cancel
            now, and later wish to resubscribe the cost will be the full $80
            monthly.
          </p>
          <hr />
          <div className='d-flex justify-content-end'>
            <LoaderButton
              variant='danger'
              size='sm'
              type='button'
              isLoading={isCanceling}
              text='Cancel'
              loadingText='Canceling...'
              onClick={this.handleCancelSubscription}
            />
          </div>
        </Alert>
      </Fragment>
    );
  }

  renderNextBill() {
    /*const { subscription, isCanceling } = this.state;
    const currentPeriodEnd = subscription.stripe.current_period_end;
    const days = nextBill(currentPeriodEnd);*/
    const { isCanceling } = this.state;

    return (
      <Fragment>
        <Card.Text>
          {/*Next payment in {days} day
          {days !== 1 ? 's' : ''}*/}
          <strong>Subscribed!</strong>
        </Card.Text>
        <LoaderButton
          variant='danger'
          size='sm'
          type='button'
          isLoading={isCanceling}
          text='Cancel'
          loadingText='Canceling...'
          onClick={this.handleCancelSubscriptionConfirmation}
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
      alertHeading,
      showCancelSubscriptionAlert
    } = this.state;
    return !isLoadingProducts ? (
      <div className='Billing'>
        {showCancelSubscriptionAlert
          ? this.renderCancelSubscriptionAlert()
          : ''}
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
        {subscription === null && (
          <StripeProvider apiKey={config.STRIPE_KEY}>
            <Elements>
              <BillingForm
                loading={isLoading}
                onSubmit={this.handleFormSubmit}
              />
            </Elements>
          </StripeProvider>
        )}
        {subscription !== null && subscription.canceled && (
          <StripeProvider apiKey={config.STRIPE_KEY}>
            <Elements>
              <BillingForm
                loading={isLoading}
                onSubmit={this.handleFormSubmit}
              />
            </Elements>
          </StripeProvider>
        )}
      </div>
    ) : (
      <Spinner animation='border' role='status'>
        <span className='sr-only'>Loading...</span>
      </Spinner>
    );
  }
}
