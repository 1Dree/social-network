import jwt from "jsonwebtoken";

export const stateSwitch = stateSetter => () =>
  stateSetter(prevState => !prevState);

export const objStateSetter = (newState, stateSetter) =>
  stateSetter(prevState => ({ ...prevState, ...newState }));

export const arrayStateSetter = (newState, stateSetter) =>
  stateSetter(prevState => [...prevState, ...newState]);

export const clearState = (initialState, stateSetter) => () =>
  stateSetter(initialState);

export const msgMoment = () => {
  const presentMoment = Date.now();
  const [hours, minutes] = [
    new Date(presentMoment).getHours(),
    new Date(presentMoment).getMinutes(),
  ];
  const withZero = unit => (unit < 10 ? "0" + unit : unit);

  return withZero(hours) + ":" + withZero(minutes);
};

export const onDiscardAnimation = callBack => (e, el) => {
  e.stopPropagation();

  el.classList.add("discard");

  el.addEventListener("animationend", callBack);
};

export const msgsMomentFormatter = moment => {
  const msgDate = new Date(moment);
  const formatter = new Intl.DateTimeFormat("pt-br", {
    timeStyle: "short",
    dateStyle: "short",
  });

  return { result: formatter.format(msgDate).split(" "), date: msgDate };
};

export const msgjwtDecoder = msg =>
  jwt.verify(msg, process.env.REACT_APP_MESSAGES_TOKEN_SECRET);

export const duplicateVerifier = (array, possibleDuplicateId) =>
  array.some(({ _id }) => _id === possibleDuplicateId);

export const arrayStateSetterDuplicatePreventer = (newItem, stateSetter) => {
  stateSetter(prevState =>
    duplicateVerifier(prevState, newItem._id)
      ? prevState
      : [...prevState, newItem]
  );
};

const lib = {
  stateSwitch,
  clearState,
  msgMoment,
  onDiscardAnimation,
  msgsMomentFormatter,
  msgjwtDecoder,
  duplicateVerifier,
  arrayStateSetterDuplicatePreventer,
};

export default lib;
