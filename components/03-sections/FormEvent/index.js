import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { nanoid } from "nanoid";
import getIcon from "utils/getIcon";

const FormEvent = ({ data }) => {
  const [dynamicEntities, setDynamicEntities] = useState([]);
  const [canAddEntities, setCanAddEntities] = useState(true);

  const renderEntityFields = (entity) =>
    entity.fields.map((field) => {
      if (field.options) {
        return (
          <select
            className="select select-primary w-full"
            defaultValue="default"
            key={field.id}
          >
            {field.options.map((option) => (
              <option
                key={option.id}
                value={option.isPlaceholder && "default"}
                disabled={option.isPlaceholder}
              >
                {option.value}
              </option>
            ))}
          </select>
        );
      } else {
        return (
          <input
            className="input input-bordered input-primary w-full"
            type="text"
            placeholder={field.placeholder}
            key={field.id}
          />
        );
      }
    });

  const renderFields = (field) => {
    if (field.isDynamic) {
      return (
        <>
          {dynamicEntities.map((entity, entityIndex) => (
            <div
              className="mb-4 flex flex-col items-center gap-4 last-of-type:mb-0 md:flex-row md:items-start"
              key={entity.id}
            >
              <div className="flex w-full flex-col gap-4 md:block md:columns-3">
                {renderEntityFields(entity)}
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
              onClick={() => createDynamicEntities()}
            >
              <FontAwesomeIcon icon={getIcon("plus")} size="xl" />
              {field.buttonAdd}
            </button>
          )}
        </>
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

            if (dynamicEntities.length + 1 === entity.maxNumber) {
              setCanAddEntities(false);
            }
          }
        }
      });
    }
  };

  useEffect(() => {
    createDynamicEntities(true);
  }, [data]);

  return (
    <>
      <section className="container py-12 lg:py-16">
        <form className="text-center" action="#" method="post">
          <ul role="list">
            {data.fields.map((field) => (
              <li key={field.id}>{renderFields(field)}</li>
            ))}
          </ul>
        </form>
      </section>
    </>
  );
};

export default FormEvent;
