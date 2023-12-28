export const updateUrlSearchParams = (params: Record<string, string>) => {
  const urlParams = new URLSearchParams(window.location.search);

  Object.entries(params).forEach(([key, value]) => {
    urlParams.set(key, encodeURIComponent(value));
  });

  window.history.pushState({}, "", `?${urlParams.toString()}`);
};
