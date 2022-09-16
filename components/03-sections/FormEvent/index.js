import { useContext, useEffect, useState } from "react";
import { clsx } from "clsx";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { nanoid } from "nanoid";
import { array, object, string } from "yup";
import GlobalContext from "context";
import getIcon from "utils/getIcon";
import relay from "utils/relay";

const FormEvent = ({ data, event }) => {
  const globalContext = useContext(GlobalContext);
  const { user, setUser } = globalContext;
  const [dynamicEntities, setDynamicEntities] = useState([]);
  const [canAddEntities, setCanAddEntities] = useState(true);
  const [changedPlatform, setChangedPlatform] = useState([false, null]);
  const [isDataRun, setIsDataRun] = useState(false);
  const { validation } = data;
  const { collectionRef, collectionSchema } = event;
  const { platform, region, profile, telegram } = validation;

  const validationSchema = object().shape({
    platforms: array().of(
      object().shape({
        platform: string().matches(/\b(?!default\b)\w+/, platform.required),
        region: string()
          .matches(/^(?!.*default)[A-Za-z\u0400-\u04FF.-\s]*/, region.required)
          .min(2, region.min)
          .required(region.required),
        profile: string().min(3, profile.min).required(profile.required),
      })
    ),
    telegram: string().min(5, telegram.min).required(telegram.required),
  });

  const onSelectInput = (e, id, entityIndex) => {
    let steamChosen;

    setIsDataRun(false);

    if (e.target.value === "steam") {
      steamChosen = true;
    } else {
      steamChosen = false;
    }

    const updatedDynamicEntities = dynamicEntities.map((entity) => {
      const entityObj = { ...entity };

      if (entityObj.id === id) {
        entityObj.fields = entity.fields.map((field) => {
          const fieldObj = { ...field };

          if (fieldObj.forSteam) {
            fieldObj.steamChosen = steamChosen;
          }

          return fieldObj;
        });
      }

      return entityObj;
    });

    setChangedPlatform([true, entityIndex]);
    setDynamicEntities(updatedDynamicEntities);
  };

  const renderEntityFields = (entity, entityIndex, values, handleChange) => {
    const { id, name } = entity;

    return entity.fields.map((field) => {
      if (
        (field.options && !field.forSteam) ||
        (field.forSteam && field.steamChosen)
      ) {
        if (
          changedPlatform[0] &&
          changedPlatform[1] === entityIndex &&
          field.forSteam &&
          field.steamChosen
        ) {
          values[name][entityIndex][field.name] = "default";
        }

        return (
          <div className="flex flex-col" key={field.id}>
            <Field
              className="select select-primary w-full"
              as="select"
              name={`${name}[${entityIndex}].${field.name}`}
              onChange={(e) => {
                handleChange(e);
                setChangedPlatform([false, null]);

                if (field.hasSteam) {
                  onSelectInput(e, id, entityIndex);
                }
              }}
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
        if (
          changedPlatform[0] &&
          changedPlatform[1] === entityIndex &&
          field.forSteam &&
          !field.steamChosen
        ) {
          values[name][entityIndex][field.name] = "";
        }

        return (
          <div className="flex flex-col" key={field.id}>
            <Field
              className="input input-primary w-full"
              type="text"
              name={`${name}[${entityIndex}].${field.name}`}
              placeholder={field.placeholder}
              onChange={(e) => {
                handleChange(e);
                setChangedPlatform([false, null]);
                setIsDataRun(false);
              }}
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

  const renderFields = (field, values, touched, handleChange, errors) => {
    if (isDataRun) {
      if (field.entitiesName) {
        values[field.entitiesName] = [
          {
            platform: "default",
            region: "",
            profile: "",
          },
        ];
      }
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
                    {renderEntityFields(
                      entity,
                      entityIndex,
                      values,
                      handleChange
                    )}
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
                    setIsDataRun(false);
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
        <div className="mx-auto w-full md:w-1/2">
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

              if (item.includes('"steamChosen"')) {
                const idItemSplitComma = splitColon[index + 1].split(",");

                idItemSplitComma[0] = false;

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
    setChangedPlatform([false, null]);
    createDynamicEntities(true);
  }, [data]);

  return (
    <>
      <section className="container pb-12 lg:pb-16">
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
            const { telegram, comments, platforms } = values;
            const steam =
              platforms.find((platform) => platform.platform === "steam") ||
              null;
            const steamRegion = steam ? steam.region : null;

            relay(
              "/api/participant/add",
              "POST",
              {
                collectionRef,
                collectionSchema,
                id: user.id,
                telegram,
                comments,
                steamRegion,
                platforms,
              },
              (res) => {
                setUser({ ...user, participant: res.body.userParticipant });
              },
              (err) => alert(err)
            );

            setSubmitting(false);
          }}
        >
          {({ values, touched, handleChange, errors, isSubmitting }) => (
            <Form className="text-center">
              <ul className="grid gap-8" role="list">
                {data.fields.map((field) => (
                  <li key={field.id}>
                    {renderFields(field, values, touched, handleChange, errors)}
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
      </section>
    </>
  );
};

export default FormEvent;
