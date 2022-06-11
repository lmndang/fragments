const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');

module.exports = (req, res) => {
  if (!req.is('text/plain')) {
    res.status(415).json(createErrorResponse(415, 'Content type not supported'));
    res.redirect('/');
  }

  const fragment = new Fragment({ ownerId: req.user, type: 'text/plain', size: 0 });
  fragment.save();
  fragment.setData(req.body);

  res.set('Location', 'http://localhost:8080/v1/fragments/' + fragment.id);

  res.status(201).json(
    createSuccessResponse({
      fragment,
    })
  );
};
