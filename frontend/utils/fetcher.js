import "isomorphic-unfetch";
import config from "../config";

const getParams = method => ({
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  },
  method
});

export default (method, url = "", payload) => {
  const body = JSON.stringify(payload);
  const params = Object.assign({}, getParams(method), { body });
  const aim = `${config.MANUAL_API}/${url}`;

  return fetch(aim, params)
    .then(rawResponse => rawResponse.json())
    .then(response => {
      if (response.errors) throw new Error(response.errors[0].message);
      return console.log(response), response;
    })
    .catch(error => {
      throw error;
    });
};
