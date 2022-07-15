import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import getIcon from "utils/getIcon";

const FormEvent = ({ data }) => {
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
      return field.entities.map((entity) => (
        <>
          <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
            <div className="flex w-full flex-col gap-4 md:block md:columns-3">
              {renderEntityFields(entity)}
            </div>
            <button
              className="btn btn-outline btn-error btn-square relative"
              title={field.buttonRemove}
              type="button"
            >
              <FontAwesomeIcon
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                icon={getIcon("xmark")}
                size="2xl"
              />
            </button>
          </div>
          <button className="btn btn-primary mt-8 gap-2" type="button">
            <FontAwesomeIcon icon={getIcon("plus")} size="xl" />
            {field.buttonAdd}
          </button>
        </>
      ));
    }
  };

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
