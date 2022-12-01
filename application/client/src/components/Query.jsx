import React, { useRef, useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import ListGroup from "react-bootstrap/ListGroup";
import { queryAll, deleteMyAsset } from "../services/apiService";

const Query = (props) => {
  const [ballots, setBallots] = useState([]);
  const [voters, setVoters] = useState([]);
  const [votable, setVotable] = useState([]);
  const [elections, setElections] = useState([]);
  useEffect(() => {

    queryAll()
      .then((r) => {

        let b = [];
        let v = [];
        let votable = [];
        let e = [];
        r.data.forEach(data => 
        {
          switch (data["Record"].type) {
            case "ballot": {
              b.push(data["Record"]);
              break;
            }
            case "voter": {
              v.push(data["Record"]);
              break;
            }
            case "votableItem": {
              votable.push(data["Record"]);
              break;
            }
            case "election": {
              e.push(data["Record"]);
              break;
            }
            default: {
              console.log(data);
              break;
            }
          }
          
        });
        setBallots(b);
        console.log(b);
        setVoters(v);
        setVotable(votable);
        setElections(e);
        
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <>
      <Container fluid className="justify-content-center">
        <Row>
          <Row>
            <Col>
              <h3>Elections</h3>
              <ListGroup>
                {elections.map((e) => {
                  return (
                    <ListGroup.Item variant="secondary" key={e.name}>
                      <p>
                        <strong>{e.name}</strong>
                      </p>
                      <p>
                        <strong>Municipality: </strong>
                        {e.municipality}
                        <strong> Region: </strong>
                        {e.region}
                      </p>
                      <p>
                        <strong>Country: </strong>
                        {e.country}
                      </p>
                      <p>
                        <strong>Start date: </strong>
                        {e.startDate}
                      </p>
                      <p>
                        <strong>End date: </strong>
                        {e.endDate}
                      </p>
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            </Col>
          </Row>
          <Col>
            <h3>Ballots</h3>
            <ListGroup>
              {ballots.map((e) => {
                return (
                  <ListGroup.Item variant="warning" key={e.ballotId}>
                    {e["election"].name ? (
                      <>
                        <p>
                          <strong>Election name: </strong>
                          {e["election"].name}
                        </p>
                        <p>
                          <strong>Choices: </strong>
                          {e.votableItems.map((v) => {
                            return v.description + ", ";
                          })}
                        </p>
                      </>
                    ) : (
                      <>
                        <p>
                          <strong>Election name: </strong>
                          {e["election"]["Record"].name}
                        </p>
                        <p>
                          <strong>Choices: </strong>
                          {e.votableItems.map((v) => {
                            return v["Record"].description + ", ";
                          })}
                        </p>
                        <p><strong style={{color: "red"}}>BALLOT USED</strong></p>
                      </>
                    )}

                    <p>
                      <strong>Ballot ID: </strong>
                      {e.ballotId}
                    </p>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <h3>Voters</h3>
            <ListGroup>
              {voters.map((b) => {
                return (
                  <ListGroup.Item variant="info" key={b.voterId}>
                    <p>
                      <strong>Voter ID:</strong>
                      {b.voterId}
                    </p>
                    {b.ballotCreated ? (
                      <p>
                        <strong>Ballot assigned:</strong> YES - {b.ballot}
                      </p>
                    ) : (
                      <p> Ballot not assigned</p>
                    )}
                    {b.ballotCast ? (
                      <p>
                        <strong>Voted:</strong> "YES-{b.picked}
                      </p>
                    ) : (
                      <p>
                        <strong>Voted:</strong> NO
                      </p>
                    )}
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <h3>Candidates</h3>
            <ListGroup>
              {votable.map((b, index) => {
                return (
                  <ListGroup.Item variant="success" key={b.votableId}>
                    <p>
                      <strong>Candidate {index+1}: </strong>
                      {b.description}
                    </p>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Query;
