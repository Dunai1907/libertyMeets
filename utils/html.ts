
export const stripHtml = (html: string) => {
  let doc = new DOMParser().parseFromString(html, "text/html");
  return (doc.body.textContent || "").trim();
};

export const simpleTextToHtml = (text: string) => {
  return text.split(/\r?\n/)
    .map(line => `${line}<br/>\n`)
    .join('');
};
