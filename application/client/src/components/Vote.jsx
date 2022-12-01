import React, { useRef, useState } from "react";
import { Form, Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import {
  validateVoter,
  castBallot,
  queryWithQueryString,
} from "../services/apiService";

const Vote = (props) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [canVote, setCanVote] = useState(false);
  const [voterSelected, setVoterSelected] = useState(null);
  const [voterID, setVoterID] = useState(null);
  const voterId = useRef(null);
  const registrarId = useRef(null);
  const firstName = useRef("");
  const lastName = useRef("");

  const handleValidateVoter = async (e) => {
    e.preventDefault();

    if (!voterId.current.value) {
      setErrorText("Enter CPR number above");
      setShowError(true);
    } else {
      const voterIDStore = voterId.current.value;
      const apiResponse = await validateVoter(voterId.current.value);
      console.log(apiResponse.data);

      if (apiResponse.data.error) {
        setErrorText(apiResponse.data.error);
        setShowError(true);
      } else {
        //display voting CastBallot
        setCanVote(true);
        setVoterID(voterIDStore);
      }
      console.log(apiResponse);
    }
  };

  const handleVote = async (e) => {
    e.preventDefault();
    const electionRes = await queryWithQueryString("election");

    let electionId = electionRes.data[0].Key;

    console.log(voterSelected);
    if (!voterSelected) {
      setErrorText("You have to pick a best school");
      setShowError(true);
    } else if (!voterID) {
      setErrorText("Try voting process again, cannot verify your voterId");
    } else {
      const apiResponse = await castBallot(electionId, voterID, voterSelected);
      console.log(apiResponse);

      if (apiResponse.data.error) {
        setErrorText(apiResponse.data.error);
        setShowError(true);
      } else if (apiResponse.data.message) {
        setErrorText(
          `We cannot find voter with voterId ${voterID} Make sure you are entering a valid voterId`
        );
        setShowError(true);
      } else {
        setShowSuccess(true);
      }
    }
  };
  
  const handleSelected=(e)=>{
    console.log(e.target.id);
    setVoterSelected(e.target.id);
  }
  return (
    <Container fluid className="justify-content-center">
      {!canVote ? (
        <>
          <Row className="justify-content-center">
            <Col sm={6}>
              <Form.Group className="mb-3" controlId="device">
                <Form.Label>CPR Number</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="2644187541"
                  ref={voterId}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="justify-content-md-center">
            <Col>
              <Button
                variant="primary"
                type="submit"
                onClick={(e) => handleValidateVoter(e)}
              >
                Check if I can vote!
              </Button>
            </Col>
          </Row>
          <Alert
            variant="danger"
            show={showError}
            onClose={() => setShowError(false)}
            dismissible
          >
            <Alert.Heading>Oh snap! Error!</Alert.Heading>
            <p>{errorText}</p>
          </Alert>
        </>
      ) : (
        <>
          <h3 className="mt-3">Choose who do you want to vote for</h3>
          <Form onChange={(e) => handleSelected(e)}>
            <div key={`inline-radio`} className="mb-3">
              <Form.Check
                inline
                label="SDU"
                name="group1"
                type="radio"
                id={`SDU`}
              />
              <Form.Check
                inline
                label="VIA Horsens"
                name="group1"
                type="radio"
                id={`VIAH`}
              />
              <Form.Check
                inline
                label="Copenhagen Business Uni"
                name="group1"
                type="radio"
                id={`CPH`}
              />
              <Form.Check
                inline
                name="group1"
                label="VIA Copenhagen"
                type="radio"
                id={`VIACPH`}
              />
            </div>
          </Form>
          <Button
            variant="primary"
            type="submit"
            onClick={(e) => handleVote(e)}
          >
            Vote
          </Button>
          <Alert show={showSuccess} variant="success">
            <p>Successfully recorded vote for {voterID} party.</p>
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
        </>
      )}
    </Container>
  );
};

export default Vote;
