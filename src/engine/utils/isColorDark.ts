const isColorDark = (rgb: string) => {
  rgb = rgb.replace(/[\s#]/g, "")
  if (rgb.length == 3) {
    rgb = rgb[0] + rgb[0] + rgb[1] + rgb[1] + rgb[2] + rgb[2]
  }
  var r = parseInt(rgb.substr(0, 2), 16)
  var g = parseInt(rgb.substr(2, 2), 16)
  var b = parseInt(rgb.substr(4, 2), 16)
  var hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b))
  return hsp < 120
}

export default isColorDark
