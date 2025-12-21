
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomeScreen from './screens/HomeScreen';
import PostRoomScreen from './screens/PostRoomScreen';
import RoomDetailScreen from './screens/RoomDetailScreen';
import InquiriesScreen from './screens/InquiriesScreen';
import ProfileScreen from './screens/ProfileScreen';
import SavedRoomsScreen from './screens/SavedRoomsScreen';
import InstallBanner from './components/InstallBanner';
import { SavedRoomsProvider } from './context/SavedRoomsContext';

const App: React.FC = () => {
  return (
    <SavedRoomsProvider>
      <Router>
        <Layout>
          <InstallBanner />
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/room/:id" element={<RoomDetailScreen />} />
            <Route path="/post" element={<PostRoomScreen />} />
            <Route path="/inquiries" element={<InquiriesScreen />} />
            <Route path="/saved" element={<SavedRoomsScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
          </Routes>
        </Layout>
      </Router>
    </SavedRoomsProvider>
  );
};

export default App;
