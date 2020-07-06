import React from 'react';
import { Grid } from 'semantic-ui-react';
import TeamHeader from '../components/TeamHeader';
import MessageInput from '../components/MessageInput';
import TeamSidebar from '../components/TeamSidebar';


const ViewTeam = () => (
    <Grid>
        <Grid.Column width={3}>
            <TeamSidebar
                teamName={'Bob is Cool'}
                username={'Bob the first'}
                channelName={['general', 'random']}
                usersToDm={['slackbot', 'Bob the first', 'Bob the second']}
            />
        </Grid.Column>
        <Grid.Column width={10}>
            <TeamHeader/>
            <MessageInput/>
        </Grid.Column>
        <MessageInput/>
    </Grid>
);

export default ViewTeam;
