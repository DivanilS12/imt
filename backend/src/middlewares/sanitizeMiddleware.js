const sanitizeValue = (value) => {
  if (typeof value === 'string') {
    return value
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
      .replace(/[<>]/g, '')
      .trim();
  }

  if (Array.isArray(value)) return value.map(sanitizeValue);

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, sanitizeValue(entry)])
    );
  }

  return value;
};

export const sanitizeInput = (req, _res, next) => {
  req.body = sanitizeValue(req.body);
  req.query = sanitizeValue(req.query);
  req.params = sanitizeValue(req.params);
  next();
};
