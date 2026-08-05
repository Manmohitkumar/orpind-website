const success = (res, data = null, statusCode = 200, message = 'Success') => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta: {
      timestamp: new Date().toISOString(),
    },
  });
};

const error = (res, statusCode = 500, code = 'INTERNAL_ERROR', message = 'An error occurred', details = null) => {
  const response = {
    success: false,
    message,
    code,
    meta: {
      timestamp: new Date().toISOString(),
    },
  };
  if (details) {
    response.details = details;
  }
  return res.status(statusCode).json(response);
};

const paginated = (res, data, pagination) => {
  return res.status(200).json({
    success: true,
    message: 'Success',
    data,
    meta: {
      timestamp: new Date().toISOString(),
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        totalPages: Math.ceil(pagination.total / pagination.limit),
        hasNext: pagination.page < Math.ceil(pagination.total / pagination.limit),
        hasPrev: pagination.page > 1,
      },
    },
  });
};

export { success, error, paginated };
