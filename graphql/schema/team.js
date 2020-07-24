export default `
    type Team {
        id: Int
        name: String
        owner: Int!
        members: [User!]!
        channels: [Channel!]!
    }
     type CreateTeamResponse {
          ok: Boolean!
          team: Team!
          errors: [Error!]
     } 
     type Query{
          allTeams: [Team!]!
          inviteTeam: [Team!]!
      }
     type VoidResponse {
            ok: Boolean!
            error: [Error!]
      }
      
     
    type Mutation {
        createTeam(name: String!): CreateTeamResponse!
        addTeamMember(email: String!, teamId: Int!): VoidResponse!
    }
`;
