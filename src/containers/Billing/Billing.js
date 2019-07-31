import React, { Component, Fragment } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
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
    subscription: null
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
      alert(error);
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
      alert('Your card has been charged successfully!');
      const canceled = false;
      this.props.setMemberType(canceled);
      this.props.history.push('/dashboard');
    } catch (e) {
      alert(e);
      this.setState({ isLoading: false });
    }
  };

  handleCancelSubscription = async event => {
    this.setState({ isCanceling: true });
    await this.cancelSubscription();
    alert('Your subscription has been canceled');
    this.setState({ isCanceling: false });
    const canceled = true;
    this.props.setMemberType(canceled);
    this.props.history.push('/profile');
  };

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
      subscription
    } = this.state;
    return (
      !isLoadingProducts && (
        <div className='Billing'>
          <Row>
            <Col md={{ span: 8, offset: 2 }}>
              <h1>Billing</h1>
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
      )
    );
  }
}
