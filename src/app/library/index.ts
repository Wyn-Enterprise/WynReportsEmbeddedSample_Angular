export const concatUrls = (...urls) => {
  const skipNullOrEmpty = (value) => !!value;
  const trimLeft = (value, char) => (value.substr(0, 1) === char ? value.substr(1) : value);
  const trimRight = (value, char) => (value.substr(value.length - 1) === char ? value.substr(0, value.length - 1) : value);
  return urls
    .map(x => x && x.trim())
    .filter(skipNullOrEmpty)
    .map((x, i) => (i > 0 ? trimLeft(x, '/') : x))
    .map((x, i, arr) => (i < arr.length - 1 ? trimRight(x, '/') : x))
    .join('/');
};

const defaultHeaders = {
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  Accept: 'application/json',
  'content-type': 'application/json',
  'pragma': 'no-cache',
};

const makeHeaders = (referenceToken) => ({ ...defaultHeaders, 'Reference-Token': referenceToken });

const performGetRequest = async (portalUrl, url, referenceToken) => {
  const response = await fetch(concatUrls(portalUrl, url),
    { headers: makeHeaders(referenceToken) });
  if (!response.ok) throw new Error(`${url} status code ${response.status}`);
  const responseJson = await response.json();
  return responseJson;
};

const postGraphQlRequest = async (portalUrl, referenceToken, requestPayload) => {
  const url = concatUrls(portalUrl, 'api/graphql');
  const init = {
    headers: makeHeaders(referenceToken),
    method: 'post',
    body: JSON.stringify(requestPayload),
  };

  const response = await fetch(url, init);
  if (!response.ok) throw new Error(`${url} status code ${response.status}`);

  const result = await response.json();
  return result;
};

export const getReportList = async (portalUrl, referenceToken) => {
  const result = await postGraphQlRequest(portalUrl, referenceToken, {
    query: 'query { documenttypes(key:"rdl") { documents { id, title } } }',
  });
  const { documents } = result.data.documenttypes[0];
  const list = documents.map(x => ({ id: x.id, name: x.title }));
  list.sort((x, y) => x.name.localeCompare(y.name));
  return list;
};

export const getReportingInfo = async (portalUrl, referenceToken) => {
  const result = await postGraphQlRequest(portalUrl, referenceToken, {
    query: 'query { me { language, themeName }, reportingInfo { version } }',
  });
  const { data: { me: { language, themeName }, reportingInfo: { version } } } = result;
  return {
    pluginVersion: version,
    theme: themeName,
    locale: language,
  };
};
