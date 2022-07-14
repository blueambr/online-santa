import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import getIcon from "utils/getIcon";

const FormEvent = () => {
  return (
    <>
      <section className="container py-12 lg:py-16">
        <form className="text-center" action="#" method="post">
          <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
            <div className="flex w-full flex-col gap-4 md:block md:columns-3">
              <select
                className="select select-primary w-full"
                defaultValue="default"
              >
                <option value="default" disabled>
                  Platform&#39;s name
                </option>
                <option>PlayStation</option>
                <option>Steam</option>
                <option>XBOX</option>
              </select>
              <select
                className="select select-primary w-full"
                defaultValue="default"
              >
                <option value="default" disabled>
                  Region
                </option>
                <option>EU</option>
                <option>Russia</option>
                <option>Turkey</option>
              </select>
              <input
                type="text"
                placeholder="Account link"
                className="input input-bordered input-primary  w-full"
              />
            </div>
            <button
              className="btn btn-outline btn-error btn-square relative"
              title="Remove this Gaming Platform"
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
            Add a Gaming Platform
          </button>
        </form>
      </section>
    </>
  );
};

export default FormEvent;
