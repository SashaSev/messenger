import React, { useState } from 'react';
import decode from 'jwt-decode';
import Channels from '../components/Channels';
import Teams from '../components/Teams';
import AddChanellModal from '../components/AddChanellModal';
import InvokeChanelModal from '../components/InvokeChannelModal';

const SideBar = ({ teams, team }) => {
  const [openModal, setOpenModal] = useState(false);
  const [openInvokeModal, setOpenInvokeModal] = useState(false);

  const handleChanelModalClose = () => {
    setOpenModal(false);
  };
  const handleChanelModal = () => {
    setOpenModal(true);
  };
  const handleInvokeClose = () => {
    setOpenInvokeModal(false);
  };
  const handleInvitePeopleClick = () => {
    setOpenInvokeModal(true);
  };
  let username = '';
  try {
    const token = localStorage.getItem('token');
    const { user } = decode(token);
    username = user.username;
  } catch (e) {

  }
  return [
        <Teams
            key={'team-sidebar'}
            teams={teams}
        />,
        <Channels
            key={'channel-sidebar'}
            teamName={team.name}
            username={username}
            teamId={team.id}
            channels={team.channels}
            onAddChannels={handleChanelModal}
            onInvitePeopleClick={handleInvitePeopleClick}
            users={[
              {
                id: 1,
                name: 'slackbot',
              },
              {
                id: 2,
                name: 'user1',
              },
            ]}
        />,
        // eslint-disable-next-line radix
        <AddChanellModal teamId={team.id} onClose={handleChanelModalClose} open={openModal}
                         key={'user-channel-modal'}/>,
        <InvokeChanelModal teamId={team.id} onClose={handleInvokeClose} open={openInvokeModal}
                           key={'invite-people-modal'}/>,

  ];
};

export default SideBar;
