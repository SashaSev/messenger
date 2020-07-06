import React from 'react';
import Grid from 'semantic-ui-react/dist/commonjs/collections/Grid';

const TeamSidebar = ({
  teamName, username, channelName, usersToDm,
}) => (
        <Grid>
            <Grid.Row>
                {teamName}
                {username}
            </Grid.Row>
            <Grid.Row>
                {
                    channelName.map((cn) => <p>{cn}</p>)
                }
            </Grid.Row>
            <Grid.Row>
                Direct messages
                {usersToDm.map((person) => <p>{person}</p>)}
            </Grid.Row>

        </Grid>
);

export default TeamSidebar;
