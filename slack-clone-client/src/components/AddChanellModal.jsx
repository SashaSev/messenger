import React from 'react';
import {
  ModalHeader, Modal, ModalContent, Form, FormField, Input, FormGroup, Button,
} from 'semantic-ui-react';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { flowRight as compose } from 'lodash';

const AddChanellModal = ({
  open, onCLose, values, handleChange, handleBlur, handleSubmit, isSubmitting,
}) => (
    <Modal open={open} onClose={onCLose}>
        <ModalHeader>Add Channel</ModalHeader>
        <ModalContent>
            <Form>
                <FormField>
                    <Input value={values.name} onChange={handleChange} onBlur={handleBlur}
                           name={'name'} fluid placeholder={'Channel name'}/>
                </FormField>
                <FormGroup widths={'equal'}>
                    <Button disabled={isSubmitting} onClick={onCLose} fluid>Cancel</Button>
                    <Button disabled={isSubmitting} onClick={handleSubmit} fluid>Create
                        Channel</Button>
                </FormGroup>
            </Form>
        </ModalContent>
    </Modal>
);

const createChannelMutation = gql`
    mutation($teamId: Int!, $name: String!){
    createChannel(teamId: $teamId, name: $name)
    }
`;

export default compose(
  graphql(createChannelMutation),
  withFormik({
    mapPropsToValues: () => ({ name: '' }),
    handleSubmit: async (values, { props: { onClose, teamId, mutate }, setSubmitting }) => {
      const response = await mutate({ variables: { teamId, name: values.name } });
      console.log(response);
      console.log('submitting ...');
      onClose();
      setSubmitting(false);
    },
  }),
)(AddChanellModal);
