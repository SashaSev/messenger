import React from 'react';
import {
  ModalHeader, Modal, ModalContent, Form, FormField, Input, FormGroup, Button,
} from 'semantic-ui-react';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { flowRight as compose } from 'lodash';
import normalizeErrors from '../NormalizeError';

const InvokeChanelModal = ({
  open, onClose, values, handleChange, handleBlur, handleSubmit, isSubmitting, touched, errors,
}) => (
    <Modal open={open} onClose={onClose}>
        <ModalHeader>Add People to your Team</ModalHeader>
        <ModalContent>
            <Form>
                <FormField>
                    <Input
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="email"
                        fluid
                        placeholder="User's email"
                    />
                </FormField>
                {touched.email && errors.email ? errors.email[0] : null}
                <FormGroup widths={'equal'}>
                    <Button disabled={isSubmitting} type={'button'} fluid onClick={onClose}>
                        Cancel
                    </Button>
                    <Button disabled={isSubmitting} type={'submit'} onClick={handleSubmit} fluid>
                        Add User
                    </Button>
                </FormGroup>
            </Form>
        </ModalContent>
    </Modal>
);

const addTeamMemberMutation = gql`
    mutation($email: String!, $teamId: Int!){
        addTeamMember(email: $email, teamId: $teamId) {
            ok
            error {
                path
                message
            }
        }
    }
`;

export default compose(
  graphql(addTeamMemberMutation),
  withFormik({
    mapPropsToValues: () => ({ email: '' }),
    handleSubmit: async (
      values, { props: { onClose, teamId, mutate }, setSubmitting, setErrors },
    ) => {
      const response = await mutate({
        variables: {
          email: values.email,
          teamId,
        },
      });
      const { ok, error } = response.data.addTeamMember;
      if (ok) {
        onClose();
        setSubmitting(false);
      } else {
        setSubmitting(false);
        setErrors(normalizeErrors(error));
      }
    },
  }),
)(InvokeChanelModal);
