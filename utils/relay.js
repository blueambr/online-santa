const relay = async (query, method, body, onSuccess, onError) => {
  await fetch(query, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : null,
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
