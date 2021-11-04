
export function capitalize(str: string) {
  return str[0].toUpperCase() + str.substring(1);
}

export function toMdBullet(str: string) {
  return `* ${str}`;
}

export function toBlockquote(str: string) {
  return `> ${str}`;
}

export function toMdURL(str: string, url: string) {
  return `[${str}](${url}/commit/${str})`;
}

export function toMdCode(str: string) {
  return `\`${str}\``;
}