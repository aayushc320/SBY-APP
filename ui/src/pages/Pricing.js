import React from 'react';

const PricingCard = ({ 
  title, 
  price, 
  period, 
  features, 
  totalAmount, 
  saveAmount, 
  isBestSeller 
}) => {
  return (
    <div className="relative bg-white rounded-lg overflow-hidden shadow-lg flex flex-col h-full">
      {isBestSeller && (
        <div className="absolute top-6 -left-10 w-40 bg-accent-500 text-white py-1 text-center transform -rotate-45 font-bold text-sm shadow-md">
          BEST SELLER
        </div>
      )}
      <div className="bg-primary-500 text-white p-5 text-center">
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="text-primary-100">Membership</p>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="text-center mb-5">
          <span className="text-xl">$</span>
          <span className="text-5xl font-bold text-gray-700">{price}</span>
          <span className="text-lg text-gray-400">99</span>
          <p className="text-gray-600">per month</p>
        </div>
        
        {saveAmount && (
          <div className="flex items-center mb-4">
            <div className="text-primary-500 mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
              </svg>
            </div>
            <span className="font-medium">Save ${saveAmount}</span>
          </div>
        )}
        
        <ul className="space-y-3 mb-8 flex-grow">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <div className="text-primary-500 mr-2 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        
        <div className="mt-auto">
          <button 
            className="w-full py-3 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-md transition-colors font-medium"
          >
            Get Membership
          </button>
          <p className="text-center mt-3 text-gray-600">Total amount - ${totalAmount}</p>
        </div>
      </div>
    </div>
  );
};

const Pricing = () => {
  // Common features for all plans
  const commonFeatures = [
    "Unlimited Group Classes",
    "Share Family Members",
    "Premium Workshops",
    "Recordings of Yoga Classes",
    "Body Weight Workout Series",
    "Weight Tracker Full Access"
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">Membership Plans</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect membership plan that suits your fitness journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Yearly Plan */}
          <PricingCard
            title="1 Year"
            price="29"
            period="month"
            features={commonFeatures}
            totalAmount="359.88"
            saveAmount="120"
            isBestSeller={true}
          />
          
          {/* 6 Month Plan */}
          <PricingCard
            title="6 Months"
            price="34"
            period="month"
            features={commonFeatures}
            totalAmount="209.94"
            saveAmount="30"
            isBestSeller={false}
          />
          
          {/* Monthly Plan */}
          <PricingCard
            title="Monthly"
            price="39"
            period="month"
            features={commonFeatures}
            totalAmount="39.99"
            saveAmount={null}
            isBestSeller={false}
          />
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Questions about our pricing? <a href="/contact" className="text-primary-500 font-medium hover:underline">Contact us</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing; 