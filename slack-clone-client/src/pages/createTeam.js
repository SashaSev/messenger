import React, { useState } from 'react';
import {
  Button, Container, Header, Input, Message,
} from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { observable } from 'mobx';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

const CreateTeam = (props) => {
  const [data, setData] = useState(() => observable({ name: '', nameError: '' }));
  const { name, nameError } = data;

  const onSubmit = async (e) => {
    setData({
      ...data,
      nameError: '',
    });
    let response;
    try {
      response = await props.mutate({
        variables: { name },
      });
    } catch (e) {
      props.history.push('/login');
      return;
    }

    const { ok, errors, team } = response.data.createTeam;
    if (ok) {
      console.log(team.id);
      props.history.push(`/view-team/${team.id}`);
    } else {
      const err = {};
      errors.forEach(({ path, message }) => {
        err[`${path}Error`] = message;
      });

      setData((prevState) => ({ ...prevState, ...err }));
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const errorList = [];

  if (nameError) {
    errorList.push(nameError);
  }
  return (
        <Container text>
            <Header as="h2">Team</Header>
            <Input
                style={{ marginBottom: '10px' }}
                name="name"
                value={name}
                error={!!nameError}
                onChange={onChange}
                placeholder={'Team name'}
                fluid/>
            <Button style={{ marginLeft: '15vw' }}
                    onClick={onSubmit}>Submit</Button>
            {
                (errorList.length > 0)
                  ? <Message error header={'There was some errors with your submission'}
                             list={errorList}/> : null
            }
        </Container>
  );
};

const loginMutation = gql`
    mutation($name: String!){
        createTeam(name: $name){
            ok,
            team{
                id
            }
            errors{
                path,
                message
            }
        }
    }
`;

export default graphql(loginMutation)(observer(CreateTeam));
