import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import axios from 'axios';
import { Box, Button, Card, Container, Grid, Typography, CircularProgress, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

// Credit packages
const CREDIT_PACKAGES = [
  { id: 'small', credits: 10, price: 20, label: '10 Credits' },
  { id: 'medium', credits: 25, price: 45, label: '25 Credits' },
  { id: 'large', credits: 50, price: 80, label: '50 Credits' },
  { id: 'premium', credits: 100, price: 150, label: '100 Credits' }
];

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CreditPurchaseForm = () => {
  const [selectedPackage, setSelectedPackage] = useState('small');
  const [processing, setProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();

  const handlePackageChange = (event) => {
    setSelectedPackage(event.target.value);
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

      // Purchase credits
      const response = await axios.post('/api/payments/purchase-credits', {
        packageType: selectedPackage,
        paymentMethodId: paymentMethod.id
      });

      if (response.data.success) {
        showToast('success', `Successfully purchased ${response.data.credits} credits!`);
        await refreshUser(); // Refresh user data to update credit balance
      } else {
        showToast('error', 'Payment failed');
      }
    } catch (error) {
      console.error('Credit purchase error:', error);
      showToast('error', error.response?.data?.message || 'Error processing payment');
    }

    setProcessing(false);
  };

  const getSelectedPackage = () => {
    return CREDIT_PACKAGES.find(pkg => pkg.id === selectedPackage);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Select Credit Package
      </Typography>
      
      <FormControl component="fieldset" sx={{ mb: 3 }}>
        <RadioGroup
          name="creditPackage"
          value={selectedPackage}
          onChange={handlePackageChange}
        >
          <Grid container spacing={2}>
            {CREDIT_PACKAGES.map((pkg) => (
              <Grid item xs={12} sm={6} key={pkg.id}>
                <Card 
                  sx={{ 
                    p: 2, 
                    border: pkg.id === selectedPackage ? '2px solid #4caf50' : '1px solid #e0e0e0',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: '#4caf50'
                    }
                  }}
                  onClick={() => setSelectedPackage(pkg.id)}
                >
                  <FormControlLabel
                    value={pkg.id}
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="h6">{pkg.label}</Typography>
                        <Typography variant="body1" color="text.secondary">
                          ${pkg.price.toFixed(2)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          (${(pkg.price / pkg.credits).toFixed(2)}/credit)
                        </Typography>
                      </Box>
                    }
                    sx={{ width: '100%', m: 0 }}
                  />
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
          `Pay $${getSelectedPackage().price.toFixed(2)}`
        )}
      </Button>
    </form>
  );
};

const CreditPurchase = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Purchase Credits
      </Typography>
      <Typography variant="body1" paragraph align="center">
        Credits can be used to book classes and access premium content.
      </Typography>
      
      <Elements stripe={stripePromise}>
        <CreditPurchaseForm />
      </Elements>
    </Container>
  );
};

export default CreditPurchase; 