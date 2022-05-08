import { patterns, instructions, inputInstruction } from "./formLib";
import { useForm } from "../../contexts/FormContext";

const withInput =
  ProtoInput =>
  ({ idPrefix, type, required }) => {
    const { formState, setFormState } = useForm();

    const typeCondition = type === "text" ? "name" : type;
    const authCondition = idPrefix.includes("auth")
      ? "auth" + type
      : typeCondition;
    const formStateProp = idPrefix.includes("retype")
      ? "rePassword"
      : authCondition;

    const placeholder =
      type === "text"
        ? "name. e.g Jhon Doe"
        : idPrefix.includes("retype")
        ? "retype your password"
        : type;

    const onChange = e => {
      setFormState(prevState => ({
        ...prevState,
        [formStateProp]: e.target.value,
      }));

      inputInstruction("")(e);
    };

    return (
      <ProtoInput
        id={`${idPrefix}-${typeCondition}`}
        type={type}
        placeholder={placeholder}
        pattern={patterns[typeCondition]}
        onInvalid={instructions[typeCondition]}
        value={formState[formStateProp]}
        onChange={onChange}
        required={required}
      />
    );
  };

export default withInput;
