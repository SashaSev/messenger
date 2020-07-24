import gql from 'graphql-tag';

export const AllTeamQuery = gql`
   query {
        allTeams {
            id
            name
            owner
            channels {
                id
                name
            }
        }
        inviteTeam {
            id
            name
            owner
            channels {
                id
                name
            }
        }
    }
`;

export const idk = {};
