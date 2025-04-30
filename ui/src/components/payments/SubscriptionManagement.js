import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import axios from 'axios';
import { 
  Box, 
  Button, 
  Card, 
  Container, 
  Grid, 
  Typography, 
  CircularProgress, 
  Radio, 
  RadioGroup, 
  FormControlLabel, 
  FormControl, 
  Tabs,
  Tab,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

// Subscription plans
const SUBSCRIPTION_PLANS = {
  monthly: {
    basic: {
      id: 'basic-monthly',
      name: 'Basic Monthly',
      price: 24.99,
      period: 'month',
      features: ['Unlimited access to recorded classes', 'Join up to 5 live classes per month', '24/7 community access']
    },
    premium: {
      id: 'premium-monthly',
      name: 'Premium Monthly',
      price: 49.99,
      period: 'month',
      features: ['Unlimited access to recorded classes', 'Unlimited live classes', 'Personal training session (1/month)', 'Priority customer support']
    }
  },
  biannual: {
    basic: {
      id: 'basic-biannual',
      name: 'Basic 6-Month',
      price: 129.99,
      period: '6 months',
      features: ['Unlimited access to recorded classes', 'Join up to 5 live classes per month', '24/7 community access'],
      savings: '13%'
    },
    premium: {
      id: 'premium-biannual',
      name: 'Premium 6-Month',
      price: 249.99,
      period: '6 months',
      features: ['Unlimited access to recorded classes', 'Unlimited live classes', 'Personal training session (1/month)', 'Priority customer support'],
      savings: '16%'
    }
  },
  annual: {
    basic: {
      id: 'basic-annual',
      name: 'Basic Annual',
      price: 219.99,
      period: 'year',
      features: ['Unlimited access to recorded classes', 'Join up to 5 live classes per month', '24/7 community access'],
      savings: '26%'
    },
    premium: {
      id: 'premium-annual',
      name: 'Premium Annual',
      price: 449.99,
      period: 'year',
      features: ['Unlimited access to recorded classes', 'Unlimited live classes', 'Personal training session (1/month)', 'Priority customer support'],
      savings: '25%'
    }
  }
};

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const SubscriptionForm = () => {
  const [selectedTier, setSelectedTier] = useState('basic');
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [processing, setProcessing] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  
  const stripe = useStripe();
  const elements = useElements();
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();

  const handleTabChange = (event, newValue) => {
    setCurrentTabIndex(newValue);
    switch(newValue) {
      case 0:
        setSelectedPlan('monthly');
        break;
      case 1:
        setSelectedPlan('biannual');
        break;
      case 2:
        setSelectedPlan('annual');
        break;
      default:
        setSelectedPlan('monthly');
    }
  };

  const handleTierChange = (event) => {
    setSelectedTier(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      // Get card element
      const cardElement = elements.getElement(CardElement);

      // Create payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        showToast('error', error.message);
        setProcessing(false);
        return;
      }

      // Create subscription
      const response = await axios.post('/api/payments/create-subscription', {
        paymentMethodId: paymentMethod.id,
        plan: selectedPlan,
        tier: selectedTier
      });

      if (response.data.success) {
        const plan = SUBSCRIPTION_PLANS[selectedPlan][selectedTier];
        showToast('success', `Successfully subscribed to ${plan.name}!`);
        await refreshUser(); // Refresh user data to update subscription status
      } else {
        showToast('error', 'Subscription failed');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      showToast('error', error.response?.data?.message || 'Error creating subscription');
    }

    setProcessing(false);
  };

  const handleCancelSubscription = async () => {
    try {
      setProcessing(true);
      const response = await axios.delete('/api/payments/subscription');
      
      if (response.data.success) {
        showToast('success', response.data.message);
        setConfirmCancel(false);
        await refreshUser(); // Refresh user data
      }
    } catch (error) {
      console.error('Cancel subscription error:', error);
      showToast('error', error.response?.data?.message || 'Error canceling subscription');
    }
    setProcessing(false);
  };

  const hasActiveSubscription = user && 
    user.subscription && 
    user.subscription.type !== 'none' && 
    user.subscription.status === 'active';

  const getSelectedPlanDetails = () => {
    return SUBSCRIPTION_PLANS[selectedPlan][selectedTier];
  };

  return (
    <>
      <Box sx={{ mb: 4 }}>
        {hasActiveSubscription ? (
          <Card sx={{ p: 3, mb: 3, bgcolor: '#f5f5f5', borderLeft: '4px solid #4caf50' }}>
            <Typography variant="h6" gutterBottom>
              Current Subscription
            </Typography>
            <Typography variant="body1">
              Plan: <strong>{user.subscription.type.charAt(0).toUpperCase() + user.subscription.type.slice(1)} {user.subscription.plan.charAt(0).toUpperCase() + user.subscription.plan.slice(1)}</strong>
            </Typography>
            <Typography variant="body1">
              Status: <strong>{user.subscription.status.charAt(0).toUpperCase() + user.subscription.status.slice(1)}</strong>
            </Typography>
            {user.subscription.startDate && (
              <Typography variant="body1">
                Started: <strong>{new Date(user.subscription.startDate).toLocaleDateString()}</strong>
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {user.subscription.autoRenew 
                ? 'Your subscription will automatically renew.' 
                : 'Your subscription will not renew automatically.'}
            </Typography>
            <Button 
              variant="outlined" 
              color="error" 
              sx={{ mt: 2 }}
              onClick={() => setConfirmCancel(true)}
              disabled={processing || !user.subscription.autoRenew}
            >
              {processing ? <CircularProgress size={24} /> : 'Cancel Subscription'}
            </Button>
          </Card>
        ) : (
          <form onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom>
              Choose Subscription Plan
            </Typography>
            
            <Box sx={{ width: '100%', mb: 3 }}>
              <Tabs 
                value={currentTabIndex} 
                onChange={handleTabChange}
                variant="fullWidth"
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab label="Monthly" />
                <Tab label="6-Month" />
                <Tab label="Annual" />
              </Tabs>
            </Box>

            <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
              <RadioGroup
                name="subscriptionTier"
                value={selectedTier}
                onChange={handleTierChange}
              >
                <Grid container spacing={3}>
                  {Object.entries(SUBSCRIPTION_PLANS[selectedPlan]).map(([tier, plan]) => (
                    <Grid item xs={12} md={6} key={tier}>
                      <Card 
                        sx={{ 
                          p: 3, 
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          border: tier === selectedTier ? '2px solid #4caf50' : '1px solid #e0e0e0',
                          cursor: 'pointer',
                          '&:hover': {
                            borderColor: '#4caf50'
                          }
                        }}
                        onClick={() => setSelectedTier(tier)}
                      >
                        <FormControlLabel
                          value={tier}
                          control={<Radio />}
                          label={
                            <Typography variant="h6" component="div">
                              {plan.name}
                            </Typography>
                          }
                          sx={{ mb: 1 }}
                        />
                        
                        <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 2 }}>
                          <Typography variant="h4" component="span">
                            ${plan.price}
                          </Typography>
                          <Typography variant="body1" color="text.secondary" component="span" sx={{ ml: 1 }}>
                            / {plan.period}
                          </Typography>
                        </Box>
                        
                        {plan.savings && (
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              bgcolor: '#e8f5e9', 
                              color: '#2e7d32', 
                              p: 0.5, 
                              borderRadius: 1, 
                              display: 'inline-block',
                              mb: 2
                            }}
                          >
                            Save {plan.savings} compared to monthly
                          </Typography>
                        )}
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            What's included:
                          </Typography>
                          <ul style={{ paddingLeft: '1.5rem', marginTop: 0 }}>
                            {plan.features.map((feature, idx) => (
                              <li key={idx}>
                                <Typography variant="body2">{feature}</Typography>
                              </li>
                            ))}
                          </ul>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </RadioGroup>
            </FormControl>

            <Typography variant="h6" gutterBottom>
              Payment Information
            </Typography>
            
            <Box sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </Box>
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={!stripe || processing}
              sx={{ mt: 2 }}
            >
              {processing ? (
                <CircularProgress size={24} />
              ) : (
                `Subscribe - $${getSelectedPlanDetails().price} / ${getSelectedPlanDetails().period}`
              )}
            </Button>
          </form>
        )}
      </Box>

      {/* Cancel Subscription Confirmation Dialog */}
      <Dialog
        open={confirmCancel}
        onClose={() => setConfirmCancel(false)}
      >
        <DialogTitle>Cancel Subscription?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel your subscription? You'll continue to have access until the end of your current billing period.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmCancel(false)} color="primary">
            No, Keep Subscription
          </Button>
          <Button 
            onClick={handleCancelSubscription} 
            color="error"
            disabled={processing}
          >
            {processing ? <CircularProgress size={24} /> : 'Yes, Cancel Subscription'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const SubscriptionManagement = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Membership Plans
      </Typography>
      <Typography variant="body1" paragraph align="center">
        Choose the plan that works best for you and your fitness goals.
      </Typography>
      
      <Elements stripe={stripePromise}>
        <SubscriptionForm />
      </Elements>
    </Container>
  );
};

export default SubscriptionManagement; 