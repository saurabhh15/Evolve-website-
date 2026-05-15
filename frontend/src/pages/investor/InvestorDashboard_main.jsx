import React from 'react';
import InvestorDashboard from '../../pages/investor/InvestorDashboard';
import DealRoom from '../../pages/investor/DealRoom';
import Discovery from '../../pages/investor/InvestorDiscover';
import Portfolio from '../../pages/investor/Portfolio';
import MyProfile from '../../pages/shared/Myprofile';
import Messages from '../../pages/shared/Messages';

const InvestorDashboard_main = ({ activeTab }) => {
  
  // Normalize the activeTab. If the user just goes to "/investor", activeTab might be undefined or 'investor'.
  const currentTab = activeTab === 'investor' || !activeTab ? 'home' : activeTab;

  return (
    <>
      {/* Base /investor URL shows the main dashboard */}
      {currentTab === 'home' && <InvestorDashboard />}
      
      {/* Deal Flow / Discovery Marketplace */}
      {currentTab === 'discovery' && <Discovery />}
      
      {/* Active deals pipeline / Due Diligence */}
      {currentTab === 'deals' && <DealRoom />}

      {/* Portfolio Management */}
      {currentTab === 'portfolio' && <Portfolio />}

      
      {/* Shared Components */}
      {currentTab === 'messages' && <Messages />}
      {currentTab === 'myprofile' && <MyProfile />}
    </>
  );
};

export default InvestorDashboard_main;