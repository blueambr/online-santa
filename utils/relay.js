const relay = (query, method, body) => {
  fetch(query, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((result) => {
      console.info("Success!", result.serverMessage);
    })
    .catch((err) => {
      console.error("Error:", err);
    });
};

export default relay;
