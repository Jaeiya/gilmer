import  { color as c } from './colors';


export function capitalize(str: string) {
  return str[0].toUpperCase() + str.substring(1);
}

export function toFileNameWithDate(name: string) {
  const nameRegex = /^[a-zA-Z0-9 ]+$/g;
  const date = (new Date()).toLocaleDateString().replace(/\//g, '_');
  if (!nameRegex.test(name)) reportFileNameError(name);
  return `${name.split(' ').join('')}.${date}`;
}

function reportFileNameError(name: string) {
  console.log(`\n   ${c.r('ERROR:')} ${c.y('Invalid File Name')} ${c.r('(')}${c.w(name)}${c.r(')')}\n`);
  console.log(
`    ${c.g('NOTE:')} File name can only contain ${c.g('spaces')}, ${c.g('a-z')}, ${c.g('A-Z')}, and ${c.g('0-9')}.
          To include spaces, wrap the file name in quotes.\n`);

  console.log(` ${c.g('EXAMPLE:')} ${c.y('"')}Acc3ptABLE t1tl3${c.y('"')}\n\n`);
  process.exit(0);
}

export function toMdBullet(str: string) {
  return `* ${str}`;
}

export function toBlockquote(str: string) {
  return `> ${str}`;
}

export function toMdURL(str: string, url: null|string) {
  if (!url) return `${str}`;
  return `[${str}](${url}/commit/${str})`;
}

export function toMdCode(str: string) {
  return `\`${str}\``;
}



