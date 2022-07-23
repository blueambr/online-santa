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
      const { isError, isSuccess, serverMessage } = result;

      if (isSuccess) {
        console.info("Success!", serverMessage);

        if (onSuccess) {
          onSuccess(result);
        }
      }

      if (isError) {
        console.info("Error!", serverMessage);

        if (onError) {
          onError();
        }
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
