export default `
 type Team {
        owner: User!
        members: [User!]!
        channels: [Channel!]!
    }
     type CraeteTeamResponse {
          ok: Boolean!
          errors: [Error!]
     } 
   
    type Mutation {
        createTeam(name: String!): CraeteTeamResponse!
    }
`