import React, { useState } from 'react';
import { graphql } from 'react-apollo';
import findIndex from 'lodash/findIndex';
import decode from 'jwt-decode';
import Channels from '../components/Channels';
import Teams from '../components/Teams';
import { AllTeamQuery } from '../graphql/team';
import AddChanellModal from '../components/AddChanellModal';

const SideBar = ({ data: { loading, allTeams }, currentTimeId }) => {
  const [openModal, setOpenModal] = useState(false);
  if (loading) {
    return null;
  }
  const handleChanelModalClose = () => {
    setOpenModal(false);
  };
  const handleChanelModal = () => {
    setOpenModal(true);
  };
  const teamIdx = currentTimeId
    ? findIndex(allTeams, ['id', parseInt(currentTimeId, 10)])
    : 0;
  const team = teamIdx !== -1 ? allTeams[teamIdx] : '';
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
            teams={
                allTeams
                && allTeams.map((t) => ({
                  id: t.id,
                  letter: t.name.charAt(0)
                    .toUpperCase(),
                }))
            }
        />,
        <Channels
            key={'channel-sidebar'}
            teamName={team.name}
            username={username}
            teamId = {team.id}
            channels={team.channels}
            onAddChannels={handleChanelModal}
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
        <AddChanellModal teamId={team.id} onClose={handleChanelModalClose} open={openModal} key={'user-channel-modal'}/>,
  ];
};

export default graphql(AllTeamQuery)(SideBar);
