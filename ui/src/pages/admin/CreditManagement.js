import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';

const CreditManagement = () => {
  // Mock data for demonstration
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      credits: 20,
      subscription: 'Premium',
      lastActive: '2023-07-10'
    },
    {
      id: 2, 
      name: 'Michael Chen',
      email: 'michael@example.com',
      avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
      credits: 30,
      subscription: 'Basic',
      lastActive: '2023-07-12'
    },
    {
      id: 3,
      name: 'Emma Wilson',
      email: 'emma@example.com',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
      credits: 15,
      subscription: 'Basic',
      lastActive: '2023-07-08'
    },
    {
      id: 4,
      name: 'John Smith',
      email: 'john@example.com',
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
      credits: 0,
      subscription: 'Premium',
      lastActive: '2023-07-15'
    },
    {
      id: 5,
      name: 'David Brown',
      email: 'david@example.com',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      credits: 5,
      subscription: 'Basic',
      lastActive: '2023-07-05'
    }
  ]);

  const [transactions, setTransactions] = useState([
    {
      id: 1,
      userId: 1,
      type: 'add',
      amount: 10,
      reason: 'Monthly subscription credits',
      date: '2023-07-01T10:00:00Z',
      admin: 'System'
    },
    {
      id: 2,
      userId: 1,
      type: 'subtract',
      amount: 1,
      reason: 'Class attendance: Morning Vinyasa Flow',
      date: '2023-07-02T09:00:00Z',
      admin: 'System'
    },
    {
      id: 3,
      userId: 2,
      type: 'add',
      amount: 20,
      reason: 'Purchase: Credit Pack',
      date: '2023-07-03T14:30:00Z',
      admin: 'System'
    },
    {
      id: 4,
      userId: 3,
      type: 'add',
      amount: 5,
      reason: 'Referral bonus',
      date: '2023-07-05T11:15:00Z',
      admin: 'John Smith'
    },
    {
      id: 5,
      userId: 4,
      type: 'add',
      amount: 10,
      reason: 'Monthly subscription credits',
      date: '2023-07-01T10:00:00Z',
      admin: 'System'
    },
    {
      id: 6,
      userId: 5,
      type: 'subtract',
      amount: 2,
      reason: 'Class attendance: Power Yoga',
      date: '2023-07-06T18:30:00Z',
      admin: 'System'
    },
    {
      id: 7,
      userId: 2,
      type: 'subtract',
      amount: 1,
      reason: 'Class attendance: Meditation',
      date: '2023-07-07T19:00:00Z',
      admin: 'System'
    }
  ]);

  // Credit packs that can be purchased
  const [creditPacks, setCreditPacks] = useState([
    {
      id: 1,
      name: 'Basic Pack',
      credits: 10,
      price: 25,
      isPopular: false
    },
    {
      id: 2,
      name: 'Standard Pack',
      credits: 20,
      price: 45,
      isPopular: true
    },
    {
      id: 3,
      name: 'Premium Pack',
      credits: 50,
      price: 100,
      isPopular: false
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [creditAmount, setCreditAmount] = useState(0);
  const [reasonText, setReasonText] = useState('');
  const [operationType, setOperationType] = useState('add');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('overview');

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get user transactions
  const getUserTransactions = (userId) => {
    return transactions
      .filter(t => t.userId === userId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // Handle credit operation
  const handleCreditOperation = () => {
    if (!selectedUser || creditAmount <= 0 || !reasonText) return;

    // Create new transaction
    const newTransaction = {
      id: transactions.length + 1,
      userId: selectedUser.id,
      type: operationType,
      amount: parseInt(creditAmount),
      reason: reasonText,
      date: new Date().toISOString(),
      admin: 'Admin User' // In a real app, this would be the current admin user
    };

    // Update transactions
    setTransactions([...transactions, newTransaction]);

    // Update user credits
    setUsers(users.map(user => {
      if (user.id === selectedUser.id) {
        const newCredits = operationType === 'add' 
          ? user.credits + parseInt(creditAmount)
          : Math.max(0, user.credits - parseInt(creditAmount));
        return { ...user, credits: newCredits };
      }
      return user;
    }));

    // Reset form
    setCreditAmount(0);
    setReasonText('');
    setIsModalOpen(false);
  };

  // Create credit pack
  const handleAddCreditPack = () => {
    // In a real application, this would open a modal to create a new credit pack
    console.log('Add credit pack functionality would be implemented here');
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Credit Management</h1>
        <p className="text-gray-600">Manage user credits and transactions</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setCurrentTab('overview')}
            className={`${
              currentTab === 'overview'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Overview
          </button>
          <button
            onClick={() => setCurrentTab('transactions')}
            className={`${
              currentTab === 'transactions'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Recent Transactions
          </button>
          <button
            onClick={() => setCurrentTab('packs')}
            className={`${
              currentTab === 'packs'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Credit Packs
          </button>
        </nav>
      </div>

      {/* Overview Tab Content */}
      {currentTab === 'overview' && (
        <div>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-500">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <h2 className="font-semibold text-gray-700">Total Credits</h2>
                  <p className="text-3xl font-bold text-gray-800">{users.reduce((sum, user) => sum + user.credits, 0)}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-500">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <h2 className="font-semibold text-gray-700">Users with Credits</h2>
                  <p className="text-3xl font-bold text-gray-800">{users.filter(user => user.credits > 0).length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-500">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div className="ml-4">
                  <h2 className="font-semibold text-gray-700">Transactions</h2>
                  <p className="text-3xl font-bold text-gray-800">{transactions.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* User Credits List */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <h3 className="text-lg font-semibold text-gray-800">User Credits</h3>
                <div className="mt-3 md:mt-0 flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search users..."
                      className="border border-gray-300 rounded-lg py-2 px-4 pl-10 block w-full text-sm"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Credits
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subscription
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Active
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img className="h-10 w-10 rounded-full object-cover" src={user.avatar} alt={user.name} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">{user.credits}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.subscription === 'Premium' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.subscription}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.lastActive}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => {
                            setSelectedUser(user);
                            setIsModalOpen(true);
                          }}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          Manage Credits
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Transactions Tab Content */}
      {currentTab === 'transactions' && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admin
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((transaction) => {
                    const user = users.find(u => u.id === transaction.userId);
                    return (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(transaction.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 flex-shrink-0">
                              <img className="h-8 w-8 rounded-full object-cover" src={user?.avatar} alt={user?.name} />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            transaction.type === 'add' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {transaction.type === 'add' ? 'Added' : 'Subtracted'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <span className={transaction.type === 'add' ? 'text-green-600' : 'text-red-600'}>
                            {transaction.type === 'add' ? '+' : '-'}{transaction.amount}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.reason}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.admin}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Credit Packs Tab Content */}
      {currentTab === 'packs' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Credit Packs</h3>
            <button
              onClick={handleAddCreditPack}
              className="bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Credit Pack
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {creditPacks.map((pack) => (
              <div 
                key={pack.id}
                className={`bg-white rounded-lg shadow-md overflow-hidden border ${pack.isPopular ? 'border-primary-500' : 'border-transparent'}`}
              >
                {pack.isPopular && (
                  <div className="bg-primary-500 text-white text-center py-1 text-sm font-semibold">
                    MOST POPULAR
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{pack.name}</h3>
                  <div className="text-3xl font-bold text-primary-600 mb-4">
                    ${pack.price}
                  </div>
                  <div className="text-gray-600 mb-4">
                    <p className="mb-2">Get <span className="font-bold">{pack.credits} credits</span> to use for classes.</p>
                    <p>Value: ${(pack.price / pack.credits).toFixed(2)} per credit</p>
                  </div>
                  <div className="flex space-x-3">
                    <button className="bg-primary-500 text-white px-4 py-2 rounded-lg w-full">
                      Edit
                    </button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded-lg">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Credit Management Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Manage Credits for {selectedUser.name}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-700">Current Credits: <span className="font-bold">{selectedUser.credits}</span></p>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Operation
              </label>
              <div className="flex">
                <button
                  type="button"
                  className={`flex-1 py-2 ${operationType === 'add' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => setOperationType('add')}
                >
                  Add Credits
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 ${operationType === 'subtract' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => setOperationType('subtract')}
                >
                  Remove Credits
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="creditAmount">
                Credit Amount
              </label>
              <input
                id="creditAmount"
                type="number"
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                min="0"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reason">
                Reason
              </label>
              <input
                id="reason"
                type="text"
                value={reasonText}
                onChange={(e) => setReasonText(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="e.g. Loyalty bonus, Class refund"
                required
              />
            </div>
            
            {/* User's recent transactions */}
            <div className="mb-6 max-h-40 overflow-y-auto">
              <h4 className="text-sm font-bold text-gray-700 mb-2">Recent Transactions</h4>
              <div className="space-y-2">
                {getUserTransactions(selectedUser.id).slice(0, 3).map(transaction => (
                  <div key={transaction.id} className="text-sm border-b border-gray-200 pb-2">
                    <div className="flex justify-between">
                      <span className={transaction.type === 'add' ? 'text-green-600' : 'text-red-600'}>
                        {transaction.type === 'add' ? '+' : '-'}{transaction.amount} credits
                      </span>
                      <span className="text-gray-500">{formatDate(transaction.date)}</span>
                    </div>
                    <p className="text-gray-600">{transaction.reason}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-200 text-gray-700 py-2 px-4 rounded mr-2 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreditOperation}
                className="bg-primary-500 text-white py-2 px-4 rounded hover:bg-primary-600"
                disabled={!creditAmount || !reasonText}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default CreditManagement; 