import Alert from "@/modules/Alert";

const InfoRecipientParticipant = ({ data }) => {
  const { recipientParticipant: info, participant, recipient } = data;

  return (
    <div className="mt-8">
      {info ? (
        <div className="flex flex-col gap-6">
          <h2 className="font-serif text-4xl font-bold">{recipient.title}:</h2>
          <div>
            <h3 className="text-2xl">{recipient.telegram}:</h3>
            <p className="text-lg text-primary">{info.telegram}</p>
          </div>
          <div>
            <h3 className="text-2xl">{participant.comments}:</h3>
            <p className="text-lg text-primary">
              {info.comments || participant.noComments}
            </p>
          </div>
          <div>
            <h3 className="text-2xl">{participant.platforms}:</h3>
            <ul className="flex flex-col gap-4 text-lg" role="list">
              {info.platforms.map((platform) => (
                <li
                  className="first:mt-2"
                  key={platform.platform + platform.profile}
                >
                  <h4 className="inline">{participant.platform}: </h4>
                  <span className="text-primary">{platform.platform}</span>
                  <h4 className="inline"> | {participant.region}: </h4>
                  <span className="text-primary">{platform.region}</span>
                  <h4 className="inline"> | {participant.profile}: </h4>
                  <span className="text-primary">{platform.profile}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div
          className="raw-html-lg"
          dangerouslySetInnerHTML={{ __html: recipient.noRecipient }}
        />
      )}
    </div>
  );
};

const InfoUserParticipant = ({ data }) => {
  const { userParticipant: info, participant, user } = data;

  return (
    <div className="collapse-arrow collapse rounded-box mt-8 border border-base-content bg-base-200 text-base-content">
      <input type="checkbox" />
      <div className="collapse-title text-xl">{user.title}</div>
      <div className="collapse-content flex flex-col gap-6">
        <div>
          <h3 className="text-lg">{participant.telegram}:</h3>
          <p className="text-primary">{info.telegram}</p>
        </div>
        <div>
          <h3 className="text-lg">{participant.comments}:</h3>
          <p className="text-primary">
            {info.comments || participant.noComments}
          </p>
        </div>
        <div>
          <h3 className="text-lg">{participant.platforms}:</h3>
          <ul className="flex flex-col gap-4" role="list">
            {info.platforms.map((platform) => (
              <li
                className="first:mt-2"
                key={platform.platform + platform.profile}
              >
                <h4 className="inline">{participant.platform}: </h4>
                <span className="text-primary">{platform.platform}</span>
                <h4 className="inline"> | {participant.region}: </h4>
                <span className="text-primary">{platform.region}</span>
                <h4 className="inline"> | {participant.profile}: </h4>
                <span className="text-primary">{platform.profile}</span>
              </li>
            ))}
          </ul>
        </div>
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
      {recipientParticipant !== null && (
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
