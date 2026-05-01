import React from 'react';
import ExploreProject from '../shared/ExploreProjects';
import CreateProject from './CreateProject';
import Myproject from './MyProjects';
import FindMentors from './FindMentors';
import StudentHome from './StudentDashboard'; 
import MyProfile from '../shared/Myprofile';
import Messages from '../shared/Messages';


const StudentDashboard_main = ({ activeTab }) => {
  
  return (
   <>
      {/* 'home' matches the base /dashboard URL */}
      {activeTab === 'home' && <StudentHome />}
      
      {/* These match the end of your URLs: /dashboard/project, /dashboard/explore */}
      {activeTab === 'project' && <Myproject />}
      {activeTab === 'explore' && <ExploreProject />}
      {activeTab === 'create' && <CreateProject />}
      {activeTab === 'mentors' && <FindMentors />}
      {activeTab === 'myprofile' && <MyProfile />}
      {activeTab === 'messages' && <Messages />}
     

    </>
  );
};

export default StudentDashboard_main;