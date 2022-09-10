import Alert from "@/modules/Alert";

const InfoEvent = ({ data }) => {
  const { info, status } = data;
  const { alert } = info;
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
    </section>
  );
};

export default InfoEvent;
