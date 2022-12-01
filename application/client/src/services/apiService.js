import Api from "./api";

export const castBallot = (electionId, voterId, picked) => {
  return Api().post("castBallot", {
    electionId: electionId,
    voterId: voterId,
    picked: picked,
  });
};

export const registerVoter = (voterId, registrarId, firstName, lastName) => {
  return Api().post("registerVoter", {
    voterId: voterId,
    registrarId: registrarId,
    firstName: firstName,
    lastName: lastName,
  });
};

export const queryAll = () => {
  return Api().get("queryAll");
};
export const queryByObjectType = () => {
  return Api().get("queryByObjectType");
};
export const queryWithQueryString = (selected) => {
  return Api().post("queryWithQueryString", {
    selected: selected,
  });
};
export const validateVoter = (voterId) => {
  return Api().post("validateVoter", {
    voterId: voterId,
  });
};
export const queryByKey = (key) => {
  return Api().post("queryByKey", {
    key: key,
  });
};
export const getCurrentStanding = () => {
  return Api().get("getCurrentStanding");
};
