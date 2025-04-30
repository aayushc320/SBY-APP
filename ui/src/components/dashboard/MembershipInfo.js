import { useState } from 'react';
import axios from 'axios';

const MembershipInfo = ({ membershipInfo, setAlert }) => {
  const [showBuyCreditsModal, setShowBuyCreditsModal] = useState(false);
  const [creditAmount, setCreditAmount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const creditOptions = [
    { amount: 5, price: 60 },
    { amount: 10, price: 110 },
    { amount: 20, price: 200 },
    { amount: 50, price: 450 }
  ];

  const membershipPlans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 50,
      description: 'Access to group classes with credit system',
      features: [
        '5 credits included monthly',
        'Book any group class for 1 credit',
        'Access to online classes',
        'No long-term commitment'
      ],
      creditsPerMonth: 5,
      unlimitedGroupClasses: false,
      unlimitedOneOnOne: false
    },
    {
      id: 'unlimited',
      name: 'Unlimited',
      price: 150,
      description: 'Unlimited group classes with special pricing on 1-on-1 sessions',
      features: [
        'Unlimited group classes',
        '2 credits included monthly',
        'Special pricing on 1-on-1 sessions',
        'Access to all online content',
        'Free guest pass monthly'
      ],
      creditsPerMonth: 2,
      unlimitedGroupClasses: true,
      unlimitedOneOnOne: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 300,
      description: 'All-inclusive membership with unlimited access to all features',
      features: [
        'Unlimited group classes',
        'Unlimited 1-on-1 sessions',
        'Priority booking',
        'Exclusive workshops access',
        'Personalized training plan',
        'Nutritional guidance'
      ],
      creditsPerMonth: 0,
      unlimitedGroupClasses: true,
      unlimitedOneOnOne: true
    }
  ];

  const handleBuyCredits = async () => {
    setIsLoading(true);
    
    try {
      // In a real app, this would integrate with a payment processor
      const res = await axios.post('/api/users/buy-credits', {
        creditAmount
      });
      
      if (res.data.success) {
        setAlert({
          type: 'success',
          message: `Successfully purchased ${creditAmount} credits!`
        });
        setShowBuyCreditsModal(false);
        
        // In a real app, you would refresh the user's credit balance
        // or the server would return the updated credit balance
        window.location.reload();
      } else {
        setAlert({
          type: 'error',
          message: res.data.message || 'Failed to purchase credits'
        });
      }
    } catch (err) {
      console.error('Error purchasing credits:', err);
      setAlert({
        type: 'error',
        message: 'Something went wrong. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpgradeMembership = async () => {
    if (!selectedPlan) return;
    
    setIsLoading(true);
    
    try {
      // In a real app, this would integrate with a payment processor
      const res = await axios.post('/api/users/upgrade-membership', {
        planId: selectedPlan.id
      });
      
      if (res.data.success) {
        setAlert({
          type: 'success',
          message: `Successfully upgraded to ${selectedPlan.name} plan!`
        });
        setShowUpgradeModal(false);
        
        // In a real app, you would refresh the user's membership info
        window.location.reload();
      } else {
        setAlert({
          type: 'error',
          message: res.data.message || 'Failed to upgrade membership'
        });
      }
    } catch (err) {
      console.error('Error upgrading membership:', err);
      setAlert({
        type: 'error',
        message: 'Something went wrong. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format date (MM/DD/YYYY)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  // Get current membership plan from the available plans
  const getCurrentPlan = () => {
    if (!membershipInfo || !membershipInfo.plan) return null;
    return membershipPlans.find(plan => plan.id === membershipInfo.plan.toLowerCase()) || null;
  };

  const currentPlan = getCurrentPlan();

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Membership & Credits</h2>
      
      {/* Current Membership Info */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm mb-8">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Current Membership</h3>
              <p className="mt-1 text-sm text-gray-500">
                Your current membership and billing information
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                currentPlan?.id === 'premium' 
                  ? 'bg-purple-100 text-purple-800' 
                  : currentPlan?.id === 'unlimited' 
                    ? 'bg-indigo-100 text-indigo-800' 
                    : 'bg-green-100 text-green-800'
              }`}>
                {membershipInfo?.plan || 'Free'}
              </span>
            </div>
          </div>
          
          <div className="mt-6 border-t border-gray-200 pt-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Membership Plan</dt>
                <dd className="mt-1 text-sm text-gray-900">{membershipInfo?.plan || 'No active membership'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    membershipInfo?.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {membershipInfo?.status || 'Inactive'}
                  </span>
                </dd>
              </div>
              
              {membershipInfo?.nextBillingDate && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Next Billing Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDate(membershipInfo.nextBillingDate)}</dd>
                </div>
              )}
              
              {membershipInfo?.memberSince && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Member Since</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDate(membershipInfo.memberSince)}</dd>
                </div>
              )}
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Monthly Credits</dt>
                <dd className="mt-1 text-sm text-gray-900">{currentPlan?.creditsPerMonth || 0}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Current Credit Balance</dt>
                <dd className="mt-1 text-sm text-gray-900">{membershipInfo?.credits || 0}</dd>
              </div>
            </dl>
          </div>
          
          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="flex flex-col sm:flex-row sm:space-x-4">
              <button
                type="button"
                onClick={() => setShowBuyCreditsModal(true)}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-3 sm:mb-0"
              >
                Buy Credits
              </button>
              
              <button
                type="button"
                onClick={() => setShowUpgradeModal(true)}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Upgrade Membership
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Membership Benefits */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Your Membership Benefits</h3>
          
          <ul className="mt-4 space-y-3">
            {currentPlan?.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="ml-2 text-sm text-gray-700">{feature}</span>
              </li>
            )) || (
              <li className="text-sm text-gray-500 italic">
                No active membership plan. Upgrade to unlock benefits.
              </li>
            )}
          </ul>
        </div>
      </div>
      
      {/* Buy Credits Modal */}
      {showBuyCreditsModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Buy Credits</h3>
            
            <div className="mt-4 space-y-4">
              <p className="text-sm text-gray-500">
                Select the number of credits you want to purchase:
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {creditOptions.map((option) => (
                  <button
                    key={option.amount}
                    type="button"
                    className={`p-4 border rounded-lg flex flex-col items-center justify-center ${
                      creditAmount === option.amount 
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                    onClick={() => setCreditAmount(option.amount)}
                  >
                    <span className="text-2xl font-bold">{option.amount}</span>
                    <span className="text-sm text-gray-500">Credits</span>
                    <span className="mt-2 text-indigo-600 font-semibold">${option.price}</span>
                  </button>
                ))}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => setShowBuyCreditsModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={handleBuyCredits}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : `Buy ${creditAmount} Credits for $${creditOptions.find(o => o.amount === creditAmount)?.price}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Upgrade Membership Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Upgrade Membership</h3>
            
            <div className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {membershipPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`border rounded-lg p-5 cursor-pointer transition-all ${
                      selectedPlan?.id === plan.id 
                        ? 'border-indigo-500 ring-2 ring-indigo-500 ring-offset-2' 
                        : 'border-gray-200 hover:border-indigo-300'
                    } ${membershipInfo?.plan.toLowerCase() === plan.id ? 'bg-gray-50' : ''}`}
                    onClick={() => membershipInfo?.plan.toLowerCase() !== plan.id && setSelectedPlan(plan)}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="text-lg font-semibold">{plan.name}</h4>
                      {membershipInfo?.plan.toLowerCase() === plan.id && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
                    <p className="mt-4 text-2xl font-bold">${plan.price}<span className="text-sm font-normal text-gray-500">/month</span></p>
                    
                    <ul className="mt-4 space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start text-sm">
                          <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="ml-2">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => setShowUpgradeModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={handleUpgradeMembership}
                  disabled={isLoading || !selectedPlan || membershipInfo?.plan.toLowerCase() === selectedPlan?.id}
                >
                  {isLoading ? 'Processing...' : selectedPlan ? `Upgrade to ${selectedPlan.name}` : 'Select a Plan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembershipInfo; 