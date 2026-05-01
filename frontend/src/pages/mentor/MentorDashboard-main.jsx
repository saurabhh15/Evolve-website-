import React, { useState } from 'react';
import MentorAnalytics from './MentorAnalytics';
import MentorDashboard from './MentorDashboard';
import MentorInquiries from './MentorInquiries';
import MentorSession from './MentorSessions';
import MentorHub from './MenorshipHub';
import MyProfile from '../shared/Myprofile';
import ExploreProject from '../shared/ExploreProjects';
import Messages from '../shared/Messages';
import CommingSoon from '../shared/CommingSoon';


const MentorDashBoard_main = ({ activeTab }) => {

  return (
    <>
      {/* 'home' matches the base /dashboard URL */}
      {activeTab === 'home' && <MentorDashboard />}

      {/* These match the end of your URLs: /dashboard/project, /dashboard/explore */}
      {activeTab === 'Meeting-room' && <CommingSoon />}
      {/* {activeTab === 'inquiries' && <MentorInquiries />} */}
      {activeTab === 'explore' && <ExploreProject />}
      {activeTab === 'MentorHub' && <MentorHub />}
      {activeTab === 'myprofile' && <MyProfile />}
      {activeTab === 'messages' && <Messages />}


    </>
  );
};

export default MentorDashBoard_main;