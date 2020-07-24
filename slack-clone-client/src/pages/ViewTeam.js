import React from 'react';
import findIndex from 'lodash/findIndex';
import { graphql } from 'react-apollo';
import { Redirect } from 'react-router-dom';
import Header from '../components/Header';
import AppLayout from '../components/AppLayout';
import SendMessage from '../components/SendMessage';
import SideBar from '../containers/SideBar';
import { AllTeamQuery } from '../graphql/team';
import MessageContainer from '../containers/MessageContainer';

const ViewTeam = ({
  data: { loading, allTeams, inviteTeam },
  match: {
    params: { teamId, channelId },
  },
}) => {
  if (loading) {
    return null;
  }

  if (!allTeams?.length) {
    return <Redirect to={'/create-team'} />;
  }
  const teams = [...allTeams, ...inviteTeam];
  const teamIdInteger = parseInt(teamId, 10);
  const teamIdx = teamIdInteger ? findIndex(teams, ['id', teamIdInteger]) : 0;
  const team = teamIdx === -1 ? teams[0] : teams[teamIdx];

  const channelIdInteger = parseInt(channelId, 10);
  const channelIdx = channelIdInteger
    ? findIndex(team.channels, ['id', channelIdInteger])
    : 0;
  const channel = channelIdx === -1 ? team.channels[0] : team.channels[channelIdx];

  return (
        <AppLayout>
            <SideBar
                teams={teams.map((t) => ({
                  id: t.id,
                  letter: t.name.charAt(0).toUpperCase(),
                }))}
                team={team}
            />
            {channel && <Header channelName={channel.name} />}
            {channel && <MessageContainer channelId={channel.id} />}
            <SendMessage channelName={channel.name} channelId={channel.id} />
        </AppLayout>
  );
};

export default graphql(AllTeamQuery)(ViewTeam);
