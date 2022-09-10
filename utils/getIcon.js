import {
  faBars,
  faCirclePlay,
  faDoorClosed,
  faDoorOpen,
  faHouse,
  faLanguage,
  faPlus,
  faUser,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const getIcon = (name) => {
  switch (name) {
    case "bars":
      return faBars;
    case "circlePlay":
      return faCirclePlay;
    case "doorClosed":
      return faDoorClosed;
    case "doorOpen":
      return faDoorOpen;
    case "house":
      return faHouse;
    case "language":
      return faLanguage;
    case "plus":
      return faPlus;
    case "user":
      return faUser;
    case "xmark":
      return faXmark;
  }
};

export default getIcon;
