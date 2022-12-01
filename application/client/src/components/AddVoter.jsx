import React, { useRef, useState } from "react";
import { Form, Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import { registerVoter } from "../services/apiService";

const AddVoter = (props) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const voterId = useRef(null);
  const registrarId = useRef(null);
  const firstName = useRef("");
  const lastName = useRef("");

  const handleRegisterVoter = async (e) => {
    e.preventDefault();
    if (
      voterId.current.value &&
      registrarId.current.value &&
      firstName.current.value &&
      lastName.current.value
    ) {
      const apiResponse = await registerVoter(
        voterId.current.value,
        registrarId.current.value,
        firstName.current.value,
        lastName.current.value
      );
      console.log(apiResponse);
      setShowSuccess(true);
    } else {
      setErrorText("Fill out all fields");
      setShowError(true);
    }
  };
  return (
    <>
      <Container fluid className="justify-content-center">
        <Row className="justify-content-center">
          <Col sm={4}>
            <Form.Group className="mb-3" controlId="device">
              <Form.Label>VOTER Unique Identification</Form.Label>
              <Form.Control
                type="number"
                placeholder="2644187541"
                ref={voterId}
              />
            </Form.Group>
          </Col>
          <Col sm={4}>
            <Form.Group className="mb-3" controlId="device">
              <Form.Label>Enter registar ID</Form.Label>
              <Form.Control type="number" placeholder="444" ref={registrarId} />
            </Form.Group>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col sm={4}>
            <Form.Group className="mb-3" controlId="device">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" ref={firstName} />
            </Form.Group>
          </Col>
          <Col sm={4}>
            <Form.Group className="mb-3" controlId="device">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" ref={lastName} />
            </Form.Group>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col>
            <Button
              variant="primary"
              type="submit"
              onClick={(e) => handleRegisterVoter(e)}
            >
              Register Voter
            </Button>
          </Col>
        </Row>
        <Alert show={showSuccess} variant="success">
          <p>New voter successfully added</p>

          <div className="d-flex justify-content-end">
            <Button
              onClick={() => setShowSuccess(false)}
              variant="outline-success"
            >
              Close
            </Button>
          </div>
        </Alert>
        <Alert
          variant="danger"
          show={showError}
          onClose={() => setShowError(false)}
          dismissible
        >
          <Alert.Heading>Oh snap! Error!</Alert.Heading>
          <p>{errorText}</p>
        </Alert>
      </Container>
    </>
  );
};

export default AddVoter;
