import withInput from "./withInput";

const ProtoInput = ({ ...props }) => <input {...props} />;
const Input = withInput(ProtoInput);

const Inputs = ({ idPrefix, types, required = [] }) => {
  return (
    <>
      {types.map((type, i) => (
        <Input
          idPrefix={idPrefix}
          type={type}
          required={required.length ? required[i] : true}
          key={type + idPrefix}
        />
      ))}
    </>
  );
};

export default Inputs;
