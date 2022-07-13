const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const contentType = require('content-type');

module.exports = async (req, res) => {
  if (!req.is('text/plain') && !req.is('application/json')) {
    res.status(415).json(createErrorResponse(415, 'Content type not supported'));
    return;
  }

  const fragment = new Fragment({ ownerId: req.user, type: contentType.parse(req).type, size: 0 });

  try {
    await fragment.save();
    await fragment.setData(Buffer.from(req.body));
  } catch (error) {
    throw new Error('Data invalid, cannot create new fragment');
  }

  //Add location of the saved data in location header
  var currentURL = req.protocol + '://' + req.get('host');
  res.set('Location', `${currentURL}/v1/fragments/${fragment.id}`);

  //Return fragment id created
  res.status(201).json(
    createSuccessResponse({
      fragment,
    })
  );
};
