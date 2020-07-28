import React, { useState, useEffect } from 'react';
import decode from 'jwt-decode';
import Channels from '../components/Channels';
import Teams from '../components/Teams';
import AddChanellModal from '../components/AddChanellModal';
import InvokeChanelModal from '../components/InvokeChannelModal';

const SideBar = ({ teams, team }) => {
  const [openModal, setOpenModal] = useState(false);
  const [openInvokeModal, setOpenInvokeModal] = useState(false);

  useEffect(() => {
    setOpenModal(false);
    return () => setOpenModal(true);
  }, []);

  const handleChanelModalClose = (e) => {
    if (e) {
      e.preventDefault();
    }
    setOpenModal(false);
  };
  const handleChanelModal = (e) => {
    if (e) {
      e.preventDefault();
    }
    setOpenModal(true);
  };
  const handleInvokeClose = (e) => {
    if (e) {
      e.preventDefault();
    }
    setOpenInvokeModal(false);
  };
  const handleInvitePeopleClick = (e) => {
    if (e) {
      e.preventDefault();
    }
    setOpenInvokeModal(true);
  };
  let username = '';
  let isOwner = false;
  try {
    const token = localStorage.getItem('token');
    const { user } = decode(token);
    username = user.username;
    isOwner = team.owner === user.id;
  } catch (e) {}
  return [
    <Teams key={'team-sidebar'} teams={teams} />,
    <Channels
      key={'channel-sidebar'}
      teamName={team.name}
      username={username}
      teamId={team.id}
      channels={team.channels}
      onAddChannels={handleChanelModal}
      isOwner={isOwner}
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
    <AddChanellModal
      teamId={team.id}
      onClose={handleChanelModalClose}
      open={openModal}
      key={'user-channel-modal'}
    />,
    <InvokeChanelModal
      teamId={team.id}
      onClose={handleInvokeClose}
      open={openInvokeModal}
      key={'invite-people-modal'}
    />,
  ];
};

export default SideBar;
