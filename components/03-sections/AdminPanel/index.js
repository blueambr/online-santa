import { clsx } from "clsx";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { object, string } from "yup";
import relay from "utils/relay";

const AdminPanel = ({ data }) => {
  const { actions, validation } = data;
  const { eventAlgo } = validation;

  const validationSchema = object().shape({
    eventAlgo: string().min(3, eventAlgo.min).required(eventAlgo.required),
  });

  return (
    <section className="container py-12 lg:py-16">
      <ul className="flex flex-col gap-8" role="list">
        {actions.map((item) => (
          <li key={item.id}>
            <Formik
              initialValues={{
                eventAlgo: "",
              }}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting }) => {
                const { eventAlgo } = values;

                relay("/api/event/run", "POST", {
                  collectionRef: eventAlgo,
                });

                setSubmitting(false);
              }}
            >
              {({ touched, errors, isSubmitting }) => (
                <Form className="text-center">
                  <h2 className="font-sans text-lg font-normal lg:text-xl">
                    {item.title}
                  </h2>
                  <div className="mt-4 flex justify-center gap-4">
                    <div className="w-full md:w-1/2">
                      <Field
                        className={clsx(
                          "input input-primary w-full",
                          errors[item.name] &&
                            touched[item.name] &&
                            "input-error"
                        )}
                        type="text"
                        name={item.name}
                        placeholder={item.placeholder}
                      />
                      <ErrorMessage
                        className="mt-2 w-full text-left font-light text-error"
                        name={item.name}
                        component="div"
                      />
                    </div>
                    <button
                      className="btn btn-primary"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {item.submit}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default AdminPanel;
