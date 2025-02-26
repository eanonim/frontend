const isEmoji = (character?: string) => {
  const charCode = (character || "").codePointAt(0)
  // Расширенный список диапазонов Unicode, содержащих эмодзи
  if ((character || "").length >= 3) return false
  if (!charCode) return false
  return (
    (charCode >= 0x1f600 && charCode <= 0x1f64f) || // Emoticons
    (charCode >= 0x1f300 && charCode <= 0x1f5ff) || // Miscellaneous Symbols and Pictographs
    (charCode >= 0x1f680 && charCode <= 0x1f6ff) || // Transport and Map Symbols
    (charCode >= 0x1f900 && charCode <= 0x1f9ff) || // Supplemental Symbols and Pictographs
    (charCode >= 0x2600 && charCode <= 0x26ff) || // Miscellaneous Symbols
    (charCode >= 0x2700 && charCode <= 0x27bf) || // Dingbats
    (charCode >= 0x1f1e6 && charCode <= 0x1f1ff) || // Regional Indicator Symbols (Flags)
    (charCode >= 0x1f100 && charCode <= 0x1f10f) || // Enclosed Alphanumeric Supplement
    (charCode >= 0x1f200 && charCode <= 0x1f251) || // Enclosed Ideographic Supplement
    (charCode >= 0x1f004 && charCode <= 0x1f02b) || // Mahjong Tiles and Domino Tiles
    (charCode >= 0x1f9d0 && charCode <= 0x1faff) || // Supplemental Symbols and Pictographs extended
    (charCode >= 0x1f774 && charCode <= 0x1f77f) || // Symbols and Pictographs Extended-A
    (charCode >= 0x1fa70 && charCode <= 0x1faff) || // Symbols and Pictographs Extended-B
    (charCode >= 0xfe00 && charCode <= 0xfe0f) || // Variation Selectors (нужны для правильной отрисовки некоторых эмодзи)
    (charCode >= 0xe0020 && charCode <= 0xe007f) || // Tag characters (используются для создания флагов)
    (charCode >= 0x10000 && charCode <= 0x10ffff) // Supplementary Private Use Area-B и далее (включает много редких символов и потенциальных эмодзи)
  )
}

export default isEmoji
