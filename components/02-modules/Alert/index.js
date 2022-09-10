import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import getIcon from "utils/getIcon";

const Alert = ({ data }) => {
  const { theme, icon, text } = data;

  return (
    <div
      className={clsx("alert shadow-lg", {
        "alert-info": theme === "info",
        "alert-success": theme === "success",
        "alert-error": theme === "error",
      })}
    >
      <div>
        <FontAwesomeIcon icon={getIcon(icon)} size="lg" />
        <div className="raw-html" dangerouslySetInnerHTML={{ __html: text }} />
      </div>
    </div>
  );
};

export default Alert;
