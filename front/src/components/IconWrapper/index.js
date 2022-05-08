import "./icon-wrapper.css";

const IconWrapper = ({ Icon, iconStyle, className, onClick }) => (
  <div className={`icon-wrapper ${className}`} onClick={onClick}>
    <Icon style={iconStyle} />
  </div>
);

export default IconWrapper;
