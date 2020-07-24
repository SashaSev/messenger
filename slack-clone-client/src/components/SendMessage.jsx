import React from 'react';
import styled from 'styled-components';
import { Input } from 'semantic-ui-react';
import { withFormik } from 'formik';
import { flowRight as compose } from 'lodash';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

const SendMessageWrapper = styled.div`
    grid-column: 3;
    grid-row: 3;
    padding: 20px
`;

const SendMessage = ({
  channelName, values, handleChange, handleBlur, handleSubmit, isSubmitting,
}) => (
    <SendMessageWrapper>
        <Input
            onKeyDown={(e) => {
              if (e.keyCode === 13 && !isSubmitting) {
                handleSubmit();
              }
            }}
            onChange={handleChange}
            onBlur={handleBlur}
            name={'message'}
            value={values.message}
            fluid placeholder={`Message # ${channelName}`}/>
    </SendMessageWrapper>
);
const CreateChannelMutation = gql`
    mutation($channelId: Int!, $text: String!) {
        createMessage(channelId: $channelId, text: $text)
    }`;

export default compose(graphql(CreateChannelMutation),
  withFormik({
    mapPropsToValues: () => ({ message: '' }),
    handleSubmit: async (values, { props: { channelId, mutate }, setSubmitting, resetForm }) => {
      if (!values.message && !values.message.trim()) {
        setSubmitting(false);
        return;
      }
      await mutate({
        variables: {
          channelId,
          text: values.message,
        },
      });
      resetForm(false);
    },
  }))(
  SendMessage,
);
