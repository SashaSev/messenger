import React from 'react';

import Header from '../components/Header';
import Messages from '../components/Messages';
import AppLayout from '../components/AppLayout';
import SendMessage from '../components/SendMessage';
import SideBar from '../containers/SideBar';

const ViewTeam = ({ match: { params } }) => (
  <AppLayout>
    <SideBar currentTimeId={params.teamId} />
    <Header channelName={'general'} />
    <Messages>
      <ul className="message-list">
        <li />
        <li />
      </ul>
    </Messages>
    <SendMessage channelName={'general'} />
  </AppLayout>
);

export default ViewTeam;
