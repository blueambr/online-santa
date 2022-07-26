import { useContext, useEffect, useState } from "react";
import { clsx } from "clsx";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { nanoid } from "nanoid";
import { array, object, string } from "yup";
import GlobalContext from "context";
import getIcon from "utils/getIcon";
import TelegramLoginWidget from "@/modules/TelegramLoginWidget";

const FormEvent = ({ data }) => {
  const globalContext = useContext(GlobalContext);
  const { user } = globalContext;
  const [dynamicEntities, setDynamicEntities] = useState([]);
  const [canAddEntities, setCanAddEntities] = useState(true);
  const [isDataRun, setIsDataRun] = useState(false);
  const { validation } = data;
  const { platform, region, profile, telegram } = validation;

  const validationSchema = object().shape({
    platforms: array().of(
      object().shape({
        platform: string().matches(/\b(?!default\b)\w+/, platform.required),
        region: string()
          .matches(/\b(?!default\b)\w+/, region.required)
          .min(2, region.min)
          .required(region.required),
        profile: string().min(3, profile.min).required(profile.required),
      })
    ),
    telegram: string().min(5, telegram.min).required(telegram.required),
  });

  const onSelectInput = (e, id) => {
    let steamChosen;

    if (e.target.value === "steam") {
      steamChosen = true;
    } else {
      steamChosen = false;
    }

    const updatedDynamicEntities = dynamicEntities.map((entity) => {
      if (entity.id === id) {
        entity.fields.forEach((field) => {
          if (field.forSteam) {
            field.steamChosen = steamChosen;
            return field;
          }
          return field;
        });
        return entity;
      }
      return entity;
    });

    setDynamicEntities(updatedDynamicEntities);
  };

  const renderEntityFields = (entity, entityIndex, values) => {
    const { id, name } = entity;

    return entity.fields.map((field) => {
      if (
        (field.options && !field.forSteam) ||
        (field.forSteam && field.steamChosen)
      ) {
        if (field.forSteam && field.steamChosen) {
          const steamRegionValue = values[name][entityIndex][field.name];

          if (!steamRegionValue) {
            values[name][entityIndex][field.name] = "default";
          }
        }

        return (
          <div className="flex flex-col" key={field.id}>
            <Field
              className="select select-primary w-full"
              as="select"
              name={`${name}[${entityIndex}].${field.name}`}
              onInput={(e) => field.hasSteam && onSelectInput(e, id)}
            >
              {field.options.map((option) => (
                <option
                  key={option.id}
                  value={
                    (option.isPlaceholder && "default") ||
                    option.code ||
                    option.value
                  }
                  disabled={option.isPlaceholder}
                >
                  {option.value}
                </option>
              ))}
            </Field>
            <ErrorMessage
              className="mt-2 w-full text-left font-light text-error"
              name={`${name}[${entityIndex}].${field.name}`}
              component="div"
            />
          </div>
        );
      } else {
        if (field.forSteam && !field.steamChosen) {
          const steamRegionValue = values[name][entityIndex][field.name];

          if (steamRegionValue) {
            values[name][entityIndex][field.name] = "";
          }
        }

        return (
          <div className="flex flex-col" key={field.id}>
            <Field
              className="input input-primary w-full"
              type="text"
              name={`${name}[${entityIndex}].${field.name}`}
              placeholder={field.placeholder}
            />
            <ErrorMessage
              className="mt-2 w-full text-left font-light text-error"
              name={`${name}[${entityIndex}].${field.name}`}
              component="div"
            />
          </div>
        );
      }
    });
  };

  const renderFields = (field, values, touched, errors) => {
    if (isDataRun) {
      values[field.entitiesName] = [
        {
          platform: "default",
          region: "",
          profile: "",
        },
      ];

      setIsDataRun(false);
    }

    if (field.isDynamic) {
      return (
        <FieldArray
          name={field.entitiesName}
          render={({ push, remove }) => (
            <div>
              {dynamicEntities.map((entity, entityIndex) => (
                <div
                  className="mb-4 flex flex-col items-center gap-4 last-of-type:mb-0 md:flex-row md:items-start"
                  key={entity.id}
                >
                  <div className="flex w-full flex-col gap-4 md:block md:columns-3">
                    {renderEntityFields(entity, entityIndex, values)}
                  </div>
                  {dynamicEntities.length >= 2 && (
                    <button
                      className="btn btn-outline btn-error btn-square relative"
                      title={field.buttonRemove}
                      type="button"
                      onClick={() => {
                        setDynamicEntities(
                          dynamicEntities.filter(
                            (entity, index) => index !== entityIndex
                          )
                        );
                        setCanAddEntities(true);
                        remove(entityIndex);
                      }}
                    >
                      <FontAwesomeIcon
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                        icon={getIcon("xmark")}
                        size="2xl"
                      />
                    </button>
                  )}
                </div>
              ))}
              {canAddEntities && (
                <button
                  className="btn btn-primary mt-8 inline-flex flex-nowrap gap-2"
                  type="button"
                  onClick={() => {
                    createDynamicEntities();
                    push({ platform: "default", region: "", profile: "" });
                  }}
                >
                  <FontAwesomeIcon icon={getIcon("plus")} size="xl" />
                  {field.buttonAdd}
                </button>
              )}
            </div>
          )}
        />
      );
    } else if (!field.isTextarea) {
      return (
        <div className="inline-block md:w-1/2">
          <Field
            className={clsx(
              "input input-primary w-full",
              errors[field.name] && touched[field.name] && "input-error"
            )}
            type="text"
            name={field.name}
            placeholder={field.placeholder}
            key={field.id}
          />
          <ErrorMessage
            className="mt-2 w-full text-left font-light text-error"
            name={field.name}
            component="div"
          />
        </div>
      );
    } else {
      return (
        <Field
          className="textarea textarea-primary min-h-[12rem] w-full md:w-1/2"
          as="textarea"
          name={field.name}
          placeholder={field.placeholder}
          key={field.id}
        />
      );
    }
  };

  const createDynamicEntities = (isFirstRun = false) => {
    if (isFirstRun || canAddEntities) {
      data.fields.map((field) => {
        if (field.isDynamic) {
          const { entity } = field;

          if (isFirstRun) {
            setDynamicEntities([entity]);
            setCanAddEntities(true);
          } else {
            const splitColon = JSON.stringify(entity).split(":");

            const splitColonUpdated = splitColon.map((item, index) => {
              if (item.includes('"id"')) {
                const idItemSplitComma = splitColon[index + 1].split(",");

                idItemSplitComma[0] = `"${nanoid()}"`;

                splitColon[index + 1] = idItemSplitComma.join();
              }

              return item;
            });

            setDynamicEntities([
              ...dynamicEntities,
              JSON.parse(splitColonUpdated.join(":")),
            ]);

            if (
              entity.maxNumber &&
              dynamicEntities.length + 1 === entity.maxNumber
            ) {
              setCanAddEntities(false);
            }
          }
        }
      });
    }
  };

  useEffect(() => {
    setIsDataRun(true);
    createDynamicEntities(true);
  }, [data]);

  return (
    <>
      <section className="container py-12 lg:py-16">
        {user === null ? (
          <div className="text-center">
            <h1 className="font-serif text-6xl text-neutral-content">
              Loading...
            </h1>
          </div>
        ) : !user ? (
          <div className="text-center">
            <TelegramLoginWidget />
          </div>
        ) : (
          <Formik
            initialValues={{
              platforms: [
                {
                  platform: "default",
                  region: "",
                  profile: "",
                },
              ],
              telegram: user.username && `https://t.me/${user.username}`,
              comments: "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              console.log(JSON.stringify(values));

              setSubmitting(false);
            }}
          >
            {({ values, touched, errors, isSubmitting }) => (
              <Form className="text-center">
                <ul className="grid gap-8" role="list">
                  {data.fields.map((field) => (
                    <li key={field.id}>
                      {renderFields(field, values, touched, errors)}
                    </li>
                  ))}
                </ul>
                <button
                  className="btn btn-primary mt-8"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {data.submit}
                </button>
              </Form>
            )}
          </Formik>
        )}
      </section>
    </>
  );
};

export default FormEvent;
