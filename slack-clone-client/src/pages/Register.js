import React, { useState } from 'react';
import {
  Container, Input, Header, Button, Message,
} from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const Register = (props) => {
  const [data, setData] = useState({
    username: '',
    usernameError: '',
    email: '',
    emailError: '',
    password: '',
    passwordError: '',
  });
  const {
    username,
    email,
    password,
    usernameError,
    emailError,
    passwordError,
  } = data;

  const onChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };
  const onSubmit = async () => {
    setData({
      ...data,
      usernameError: '',
      emailError: '',
      passwordError: '',
    });
    const response = await props.mutate({
      variables: {
        username,
        email,
        password,
      },
    });
    // console.log(response);
    const { ok, errors } = response.data.register;

    if (ok) {
      props.history.push('/');
    } else {
      const err = {};
      errors.forEach(({ path, message }) => {
        err[`${path}Error`] = message;
      });

      setData((prevState) => ({ ...prevState, ...err }));
    }
  };
  const errorList = [];
  if (usernameError) {
    errorList.push(usernameError);
  }
  if (emailError) {
    errorList.push(emailError);
  }
  if (passwordError) {
    errorList.push(passwordError);
  }

  return (
        <Container text>
            <Header as="h2">Register</Header>
            <Input
                style={{ marginBottom: '10px' }}
                error={!!usernameError}
                name="username"
                value={data.username}
                onChange={onChange}
                placeholder={'Username'}
                fluid
            />
            <Input
                style={{ marginBottom: '10px' }}
                error={!!emailError}
                name="email"
                value={data.email}
                onChange={onChange}
                placeholder={'Email'}
                fluid
            />
            <Input
                style={{ marginBottom: '10px' }}
                error={!!passwordError}
                type={'password'}
                name="password"
                value={data.password}
                onChange={onChange}
                placeholder={'Password'}
                fluid
            />
            <Button style={{ marginLeft: '15vw' }} onClick={onSubmit}>
                Submit
            </Button>
            {errorList.length > 0 ? (
                <Message
                    error
                    header={'There was some errors with your submission'}
                    list={errorList}
                />
            ) : null}
        </Container>
  );
};
const registerMutation = gql`
    mutation($username: String!, $email: String!, $password: String!) {
        register(username: $username, email: $email, password: $password) {
            ok
            errors {
                path
                message
            }
        }
    }
`;

export default graphql(registerMutation)(Register);
