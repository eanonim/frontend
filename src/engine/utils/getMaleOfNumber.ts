const getMaleOfNumber = (type: "man" | "woman" | "any") =>
  ({
    man: 0,
    woman: 1,
    any: 2,
  }[type ?? "any"])

export default getMaleOfNumber
