import { useRouter } from "next/router";
import Alert from "@/modules/Alert";

const InfoRecipientParticipant = ({ data }) => {
  const {
    recipientParticipant: info,
    participant,
    recipient,
    steamRegions,
  } = data;

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
                  <div>
                    <h4 className="inline">{participant.platform}: </h4>
                    <span className="text-primary">
                      {platform.platform[0].toUpperCase() +
                        platform.platform.substring(1)}
                    </span>
                  </div>
                  <div>
                    <h4 className="inline">{participant.region}: </h4>
                    <span className="text-primary">
                      {platform.platform === "steam"
                        ? steamRegions[platform.region]
                        : platform.region}
                    </span>
                  </div>
                  <div>
                    <h4 className="inline">{participant.profile}: </h4>
                    <span className="text-primary">{platform.profile}</span>
                  </div>
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
  const { userParticipant: info, participant, user, steamRegions } = data;

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
                <div>
                  <h4 className="inline">{participant.platform}: </h4>
                  <span className="text-primary">
                    {platform.platform[0].toUpperCase() +
                      platform.platform.substring(1)}
                  </span>
                </div>
                <div>
                  <h4 className="inline">{participant.region}: </h4>
                  <span className="text-primary">
                    {platform.platform === "steam"
                      ? steamRegions[platform.region]
                      : platform.region}
                  </span>
                </div>
                <div>
                  <h4 className="inline">{participant.profile}: </h4>
                  <span className="text-primary">{platform.profile}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const InfoEvent = ({ data }) => {
  const router = useRouter();
  const { locale } = router;
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

  const steamRegions = () => {
    switch (locale) {
      case "en":
        return {
          cis: "CIS",
          eu: "EU",
          kz: "Kazakhstan",
          ru: "Russia",
          tr: "Turkey",
          ua: "Ukraine",
        };
      case "ru":
        return {
          cis: "СНГ",
          eu: "ЕС",
          kz: "Казахстан",
          ru: "РФ",
          tr: "Турция",
          ua: "Украина",
        };
    }
  };

  return (
    <section className="container pb-12 lg:pb-16">
      <Alert data={dataAlert()} />
      {recipientParticipant !== null && (
        <InfoRecipientParticipant
          data={{
            recipientParticipant,
            participant,
            recipient,
            steamRegions: steamRegions(),
          }}
        />
      )}
      {userParticipant && (
        <InfoUserParticipant
          data={{
            userParticipant,
            participant,
            user,
            steamRegions: steamRegions(),
          }}
        />
      )}
    </section>
  );
};

export default InfoEvent;
