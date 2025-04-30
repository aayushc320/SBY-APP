import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import DownloadIcon from '@mui/icons-material/Download';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const PaymentHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const response = await axios.get('/api/payments/history');
        if (response.data.success) {
          setTransactions(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching payment history:', error);
        showToast('error', 'Failed to load payment history');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, [showToast]);

  const handleDownloadInvoice = async (transactionId) => {
    try {
      const response = await axios.get(`/api/payments/invoice/${transactionId}`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${transactionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading invoice:', error);
      showToast('error', 'Failed to download invoice');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      case 'refunded':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTransactionTypeLabel = (type) => {
    switch (type) {
      case 'credit_purchase':
        return 'Credit Purchase';
      case 'subscription_payment':
        return 'Subscription';
      case 'class_purchase':
        return 'Class Purchase';
      case 'refund':
        return 'Refund';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading payment history...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Payment History</Typography>
        {user?.credits !== undefined && (
          <Chip
            label={`${user.credits} Credits Available`}
            color="primary"
            icon={<ReceiptIcon />}
            sx={{ fontSize: '1rem', py: 2.5, px: 1 }}
          />
        )}
      </Box>

      {transactions.length === 0 ? (
        <Card sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1">
            You don't have any payment history yet.
          </Typography>
        </Card>
      ) : (
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Invoice</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction._id} hover>
                  <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    {getTransactionTypeLabel(transaction.type)}
                    {transaction.credits > 0 && (
                      <Typography variant="body2" color="text.secondary">
                        +{transaction.credits} credits
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    ${transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)} 
                      color={getStatusColor(transaction.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Download Invoice">
                      <IconButton
                        onClick={() => handleDownloadInvoice(transaction._id)}
                        color="primary"
                        disabled={transaction.status !== 'completed'}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Questions about billing?
        </Typography>
        <Typography variant="body1" paragraph>
          If you have any questions about your billing or need help with payment issues, please contact our support team at <strong>support@strongbyyoga.com</strong> or visit our help center.
        </Typography>
        <Button variant="outlined" color="primary">
          Contact Support
        </Button>
      </Box>
    </Container>
  );
};

export default PaymentHistory; 