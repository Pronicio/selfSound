export function secondsToString(seconds, aff) {
  const numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
  const numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
  const numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;

  if (numhours <= 0) {
    return `${("0" + numminutes).slice(-2)}:${(
      "0" + Math.trunc(numseconds)
    ).slice(-2)}${aff ? "min" : ""}`;
  }

  return `${("0" + numhours).slice(-2)}:${("0" + numminutes).slice(-2)}:${(
    "0" + Math.trunc(numseconds)
  ).slice(-2)}${aff ? "h" : ""}`;
}
