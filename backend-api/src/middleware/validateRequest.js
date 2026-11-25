/**
 * Validates part of the request against a Zod schema before the controller runs.
 *
 *   router.post('/login', validateRequest(loginSchema), login);
 *   router.put('/:id', validateRequest(idParamsSchema, 'params'), ...);
 *
 * On success the parsed (trimmed, lower-cased, defaulted …) data replaces req.body,
 * so controllers work with clean values. On failure it answers 400 with every problem found.
 */
const validateRequest =
  (schema, source = 'body') =>
  (req, res, next) => {
    const result = schema.safeParse(req[source] ?? {});

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join('.') || source,
        message: issue.message,
      }));
      return res.status(400).json({
        // Same shape as the other errors ({ error: string }), plus the full list
        error: details.map((d) => d.message).join(', '),
        details,
      });
    }

    // req.body can be replaced; req.params/req.query are read-only getters in Express 5
    if (source === 'body') {
      req.body = result.data;
    } else {
      Object.assign(req[source], result.data);
    }
    next();
  };

export default validateRequest;
