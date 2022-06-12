const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');

module.exports = async (req, res) => {
  if (!req.is('text/plain')) {
    res.status(415).json(createErrorResponse(415, 'Content type not supported'));
    return;
  }

  const fragment = new Fragment({ ownerId: req.user, type: 'text/plain', size: 0 });
  await fragment.save();
  await fragment.setData(req.body);

  res.set('Location', `${process.env.API_URL}/v1/fragments/${fragment.id}`);

  res.status(201).json(
    createSuccessResponse({
      fragment,
    })
  );
};
