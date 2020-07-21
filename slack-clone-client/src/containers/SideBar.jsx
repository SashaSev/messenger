import React from "react";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import Channels from "../components/Channels";
import Teams from "../components/Teams";
import findIndex from "lodash/findIndex";
import decode from "jwt-decode";

const SideBar = ({ data: { loading, allTeams }, currentTimeId }) => {
  if (loading) {
    return null;
  }
  const teamIdx = currentTimeId
    ? findIndex(allTeams, ["id", parseInt(currentTimeId, 10)])
    : 0;

  console.log(teamIdx, currentTimeId, allTeams);
  const team = teamIdx !== -1 ? allTeams[teamIdx] : "";
  let username = "";
  try {
    const token = localStorage.getItem("token");
    const { user } = decode(token);
    username = user.username;
  } catch (e) {}

  return [
    <Teams
      key={"team-sidebar"}
      teams={
        allTeams &&
        allTeams.map((t) => ({
          id: t.id,
          letter: t.name.charAt(0).toUpperCase(),
        }))
      }
    />,
    <Channels
      key={"channel-sidebar"}
      teamName={team.name}
      username={username}
      channels={team.channels}
      users={[
        {
          id: 1,
          name: "slackbot",
        },
        {
          id: 2,
          name: "user1",
        },
      ]}
    />,
  ];
};

const allTeamQuery = gql`
  {
    allTeams {
      id
      name
      channels {
        id
        name
      }
    }
  }
`;

export default graphql(allTeamQuery)(SideBar);
