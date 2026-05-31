const toBoolean = (value) => {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  return value;
};

const toNumber = (value, defaultValue = 0) => {
  const number = Number(value);
  return Number.isNaN(number) ? defaultValue : number;
};

const createAccentRegex = (keyword) => {
  if (!keyword) return "";
  const noAccent = keyword.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  let regexStr = "";
  for (let i = 0; i < noAccent.length; i++) {
    const char = noAccent[i].toLowerCase();
    switch (char) {
      case "a": regexStr += "[aàáảãạăằắẳẵặâầấẩẫậAÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬ]"; break;
      case "e": regexStr += "[eèéẻẽẹêềếểễệEÈÉẺẼẸÊỀẾỂỄỆ]"; break;
      case "i": regexStr += "[iìíỉĩịIÌÍỈĨỊ]"; break;
      case "o": regexStr += "[oòóỏõọôồốổỗộơờớởỡợOÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢ]"; break;
      case "u": regexStr += "[uùúủũụưừứửữựUÙÚỦŨỤƯỪỨỬỮỰ]"; break;
      case "y": regexStr += "[yỳýỷỹỵYỲÝỶỸỴ]"; break;
      case "d": regexStr += "[dđDĐ]"; break;
      default:
        if ("-[]/{}()*+?.\\^$|".includes(char)) {
          regexStr += "\\" + char;
        } else {
          regexStr += char;
        }
    }
  }
  return regexStr;
};

module.exports = {
  toBoolean,
  toNumber,
  createAccentRegex,
};
