export const splitMarkdown = (md: string, max = 20000) => {
  const chunks: string[] = [];
  let buf = "";
  for (const line of md.split("\n")) {
    if (buf.length + line.length + 1 > max) {
      chunks.push(buf);
      buf = "";
    }
    buf += (buf ? "\n" : "") + line;
  }
  if (buf) chunks.push(buf);
  return chunks;
};
