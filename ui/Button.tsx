type ButtonType = "green" | "default";

interface ButtonProps {
  // 인터페이스 buttonProps를 선언합니다.
  type: ButtonType; // type은 ButtonType으로 선언합니다. = ButtonProps는 type이라는 attribute을 가지고 있습니다. // type의 자료형은 ButtonType입니다.
  style?: React.CSSProperties;
}

function Button({ type, style }: ButtonProps) {
  const defaultStyle = {
    position: "absolute",
    width: 337,
    height: 49,
    left: 46,
    background: type === "green" ? "#1ED760" : "#121212",
    borderRadius: 45,
    border: type === "green" ? "none" : "0.6px solid #FFFFFF",
    boxSizing: "border-box",
    ...style,
  };
  return <div style={defaultStyle}></div>;
}
// top: type === "green" ? 605 : 666,

export default Button;
