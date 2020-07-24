import React from 'react'
import {
    ModalHeader,
    Modal,
    ModalContent,
    Form,
    FormField,
    Input,
    FormGroup,
    Button,
} from 'semantic-ui-react'
import { withFormik } from 'formik'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import { flowRight as compose } from 'lodash'
import findIndex from 'lodash/findIndex'
import { AllTeamQuery } from '../graphql/team'

const AddChanellModal = ({
    open,
    onClose,
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
}) => (
    <Modal open={open} onClose={onClose}>
        <ModalHeader>Add Channel</ModalHeader>
        <ModalContent>
            <Form>
                <FormField>
                    <Input
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name={'name'}
                        fluid
                        placeholder={'Channel name'}
                    />
                </FormField>
                <FormGroup widths={'equal'}>
                    <Button disabled={isSubmitting} onClick={onClose} fluid>
                        Cancel
                    </Button>
                    <Button
                        disabled={isSubmitting}
                        onClick={handleSubmit}
                        fluid
                    >
                        Create Channel
                    </Button>
                </FormGroup>
            </Form>
        </ModalContent>
    </Modal>
)

const createChannelMutation = gql`
    mutation($teamId: Int!, $name: String!) {
        createChannel(teamId: $teamId, name: $name) {
            ok
            channel {
                id
                name
            }
        }
    }
`

export default compose(
    graphql(createChannelMutation),
    withFormik({
        mapPropsToValues: () => ({ name: '' }),
        handleSubmit: async (
            values,
            { props: { onClose, teamId, mutate }, setSubmitting }
        ) => {
            const response = await mutate({
                variables: {
                    teamId,
                    name: values.name,
                },
                optimisticResponse: {
                    __typename: 'Mutation',
                    createChannel: {
                        ok: true,
                        channel: {
                            __typename: 'Channel',
                            id: -1,
                            name: values.name,
                        },
                    },
                },
                update: (store, { data: { createChannel } }) => {
                    const { ok, channel } = createChannel
                    console.log(createChannel)
                    if (!ok) {
                        return
                    }
                    const data = store.readQuery({ query: AllTeamQuery })
                    const teamIdx = findIndex(data.allTeams, ['id', teamId])
                    data.allTeams[teamIdx].channels.push(channel)
                    store.writeQuery({
                        query: AllTeamQuery,
                        data,
                    })
                },
            })
            onClose()
            setSubmitting(false)
        },
    })
)(AddChanellModal)
