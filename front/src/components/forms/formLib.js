export const inputInstruction =
  instruction =>
  ({ target }) => {
    target.setCustomValidity(instruction);
  };

const patternsMatrix = keys =>
  [
    /^[A-Z]{1}[a-zA-Z]{1,10}\s[A-Z]{1}[a-zA-Z]{1,10}$/,
    /^\w{3,8}@gmail.com$/,
    /^\w{8,12}/,
  ].reduce((acc, pattern, i) => {
    acc[keys[i]] = pattern.toString().replace(/\//g, "");

    return acc;
  }, {});

export const patterns = patternsMatrix(["name", "email", "password"]);

export const instructions = {
  name: inputInstruction(
    "It should have two proper nouns with a maximum of 10 caracters each."
  ),
  email: inputInstruction(
    "It must be without spaces and end with '@gmail.com'."
  ),
  password: inputInstruction(
    "Must be alphanumeric, without spaces, and contain 8 to 12 characters"
  ),
};

const formLib = {
  inputInstruction,
  patterns,
  instructions,
};

export default formLib;
