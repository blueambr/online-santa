const relay = (query, method, body, onSuccess, onError) => {
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

      if (onSuccess) {
        onSuccess();
      }
    })
    .catch((err) => {
      console.error("Error:", err);

      if (onError) {
        onError();
      }
    });
};

export default relay;
