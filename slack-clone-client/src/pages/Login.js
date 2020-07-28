import React, { useState } from 'react';
import {
  Button, Container, Header, Input, Message,
} from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { observable } from 'mobx';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

const Login = (props) => {
  const [data, setData] = useState(() => observable({
    email: '',
    password: '',
    emailError: '',
    passwordError: '',
  }));
  const {
    email, password, emailError, passwordError,
  } = data;
  const onSubmit = async () => {
    setData({
      ...data,
      emailError: '',
      passwordError: '',
    });
    const response = await props.mutate({
      variables: { email, password },
    });
    const {
      ok, errors, token, refreshToken,
    } = response.data.login;
    if (ok) {
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      props.history.push('/');
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

  if (emailError) {
    errorList.push(emailError);
  }
  if (passwordError) {
    errorList.push(passwordError);
  }
  return (
    <Container text>
      <Header as="h2">Login</Header>
      <Input
        style={{ marginBottom: '10px' }}
        name="email"
        value={email}
        onChange={onChange}
        placeholder={'Email'}
        fluid
      />
      <Input
        style={{ marginBottom: '10px' }}
        type={'password'}
        name="password"
        value={password}
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

const loginMutation = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ok
      token
      refreshToken
      errors {
        path
        message
      }
    }
  }
`;

export default graphql(loginMutation)(observer(Login));
