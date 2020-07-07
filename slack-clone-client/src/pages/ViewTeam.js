import React from 'react';


import Header from '../components/Header';
import Messages from '../components/Messages';
import AppLayout from '../components/AppLayout';
import SendMessage from '../components/SendMessage';
import SideBar from '../containers/SideBar';

const ViewTeam = () => (
  <AppLayout>

    <Header channelName={"general"}/>
    <Messages>
      <ul className="message-list">
        <li/>
        <li/>
      </ul>
    </Messages>
  <SendMessage channelName={"general"}/>
  <SideBar currentTimeId={1}/>
  </AppLayout>
);

export default ViewTeam;
