import gql from 'graphql-tag';

export const AllTeamQuery = gql`
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
