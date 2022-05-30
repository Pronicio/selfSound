export function secondsToString(seconds, aff) {
  let numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
  let numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
  let numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;

  if (numhours <= 0) {
    return `${("0" + numminutes).slice(-2)}:${(
      "0" + Math.trunc(numseconds)
    ).slice(-2)}${aff ? "min" : ""}`;
  }

  return `${("0" + numhours).slice(-2)}:${("0" + numminutes).slice(-2)}:${(
    "0" + Math.trunc(numseconds)
  ).slice(-2)}${aff ? "h" : ""}`;
}
