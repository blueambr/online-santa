import Alert from "@/modules/Alert";

const InfoRecipientParticipant = ({ data }) => {
  const { recipientParticipant: info, participant, recipient } = data;

  return <div className="mt-8">Recipient</div>;
};

const InfoUserParticipant = ({ data }) => {
  const { userParticipant: info, participant, user } = data;

  return (
    <div className="collapse collapse-arrow rounded-box mt-8 border border-neutral-content bg-neutral text-neutral-content">
      <input type="checkbox" />
      <div className="collapse-title text-xl">{user.title}</div>
      <div className="collapse-content flex flex-col gap-2">
        <p>
          <h3 className="text-lg">{participant.telegram}:</h3>
          <p>{info.telegram}</p>
        </p>
        <p>
          <h3 className="text-lg">{participant.comments}:</h3>
          <p>{info.comments || participant.noComments}</p>
        </p>
        <p>
          <h3 className="text-lg">{participant.platforms}:</h3>
          <ul role="list">
            {info.platforms.map((platform) => (
              <li key={platform.platform + platform.profile}>
                <h4 className="inline">{participant.platform}: </h4>
                <span>{platform.platform} | </span>{" "}
                <h4 className="inline">{participant.region}: </h4>
                <span>{platform.region} | </span>
                <h4 className="inline">{participant.profile}: </h4>
                <span>{platform.profile}</span>
              </li>
            ))}
          </ul>
        </p>
      </div>
    </div>
  );
};

const InfoEvent = ({ data }) => {
  const { info, status, userParticipant, recipientParticipant } = data;
  const { alert, participant, user, recipient } = info;
  const { open, ongoing, closed } = alert;

  const dataAlert = () => {
    switch (status) {
      case "open":
        return open;
      case "ongoing":
        return ongoing;
      case "closed":
        return closed;
    }
  };

  return (
    <section className="container py-12 lg:py-16">
      <Alert data={dataAlert()} />
      {recipientParticipant && (
        <InfoRecipientParticipant
          data={{ recipientParticipant, participant, recipient }}
        />
      )}
      {userParticipant && (
        <InfoUserParticipant data={{ userParticipant, participant, user }} />
      )}
    </section>
  );
};

export default InfoEvent;
