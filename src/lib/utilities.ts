

export function capitalize(str: string) {
  return str[0].toUpperCase() + str.substring(1);
}

export function toMdBullet(str: string) {
  return `* ${str}`;
}

export function toBlockquote(str: string) {
  const newStr = str.replace(/\n/g, ' '); // Let lines break naturally
  return `> ${newStr}`;
}

export function toMdURL(str: string, url: null|string) {
  if (!url) return `${str}`;
  return `[${str}](${url}/commit/${str})`;
}

export function toMdCode(str: string) {
  return `\`${str}\``;
}



