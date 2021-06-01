export function byteToHexString(uint8arr: any) {
  if (!uint8arr) {
    return "";
  }

  var hexStr = "";
  for (var i = 0; i < uint8arr.length; i++) {
    var hex = (uint8arr[i] & 0xff).toString(16);
    hex = hex.length === 1 ? "0" + hex : hex;
    hexStr += hex;
  }

  return hexStr.toUpperCase();
}
