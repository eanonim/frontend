const renameSize = (size?: "small" | "medium" | "large" | "regular" | "auto") =>
  ({
    small: "s",
    medium: "m",
    large: "l",
    regular: "r",
    auto: "at",
  }[size || "medium"] ?? "m")

export default renameSize
