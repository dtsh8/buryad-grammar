// Splits a form into [stem, ending]: the ending is whatever follows the part shared with the
// base. морин → мориной (морин|ой), мориие (мори|ие), морёор (мор|ёор).
export function splitEnding(base: string, form: string): [string, string] {
  const b = base.toLowerCase();
  const f = form.toLowerCase();
  let i = 0;
  while (i < b.length && i < f.length && b[i] === f[i]) i++;
  return [form.slice(0, i), form.slice(i)];
}
