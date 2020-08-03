import React, { useEffect } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import {
  Comment,
  CommentAction,
  CommentAuthor,
  CommentContent,
  CommentGroup,
  CommentMetadata,
  CommentText,
  CommentActions,
} from 'semantic-ui-react';
import Messages from '../components/Messages';

const newChannelMessageSubscription = gql`
    Subscription($channelId: Int!){
       newChannelMessage(channelId: $channelId){
           id,
           next
           user {
             username
           }
           created_at
       }
    }
`;

const MessageContainer = ({ channelId, data: { loading, message } }) => {
  useEffect(() => {
    message.subscribeToMore({
      document: newChannelMessageSubscription,
      variables: {
        channelId,
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) {
          return prev;
        }

        return {
          ...prev,
          messages: [...prev.messages, subscriptionData.newChannelMessage],
        };
      },
    });
  }, [channelId, message]);
  return loading ? null
    : (
      <Messages channelId={channelId}>
        <CommentGroup>
          {message.map((n) => (
            <Comment key={`${n.id}-message`}>
              <CommentContent>
                <CommentAuthor as={'a'}>{n.user.username}</CommentAuthor>
                <CommentMetadata>
                  <div>{n.createdAt}</div>
                </CommentMetadata>
                <CommentText>{n.text}</CommentText>
                <CommentActions>
                  <CommentAction>Reply</CommentAction>
                </CommentActions>
              </CommentContent>
            </Comment>
          ))}
        </CommentGroup>
      </Messages>
    );
};

const GetMessagesQuery = gql`
    query($channelId: Int!) {
        message(channelId: $channelId) {
            id
            text
            user {
                username
            }
            createdAt
        }
    }
`;

export default graphql(GetMessagesQuery, {
  variables: (props) => ({
    channelId: props.channelId,
  }),
})(MessageContainer);
