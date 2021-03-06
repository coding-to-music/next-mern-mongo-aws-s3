import React, { useContext } from 'react';
import { Container, Card, Alert } from 'react-bootstrap';
import Main from '../Main';
import LoginForm from './Components/LoginForm';
import { AuthContext } from '../../store/Context/Context';

const Login = () => {
  const { auth } = useContext(AuthContext);

  return (
    <Main>
      <section>
        <Container
          className="bg-light pt-5 pb-5"
          style={{ minHeight: 'calc(100vh - 60px)' }}
        >
          {auth.isAuthenticated ? (
            <Card>
              <Card.Header>
                <h5>Σύνδεση Card Header</h5>
              </Card.Header>
              <Card.Body>Card Body Είστε συνδεδεμένος</Card.Body>
            </Card>
          ) : (
            <Card>
              <Card.Header>
                <h5>Σύνδεση Card Header2</h5>
              </Card.Header>
              <Card.Body>
                <LoginForm />
              </Card.Body>
              {auth.isError ? (
                <Card.Footer>
                  <Alert variant="danger" dismissible>
                    <Alert.Heading>Alert1 Λάθος κωδικός πρόσβασης ή email</Alert.Heading>
                    <p>Alert Text2 Πληκτρολόγησε ξανα τον κωδικό σου</p>
                  </Alert>
                </Card.Footer>
              ) : null}
            </Card>
          )}
        </Container>
      </section>
    </Main>
  );
};

export default Login;
