//Refactor to Use the response.js Functions
const { createSuccessResponse, createErrorResponse } = require('../../response');

const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
  const fragmentList = await Fragment.byUser(req.user);
  const idParams = req.params.id;

  let isIDValid = false;

  //Check if ID is exist
  fragmentList.forEach((id) => {
    if (idParams === id) {
      isIDValid = true;
    }
  });

  if (isIDValid) {
    try {
      Fragment.delete(req.user, idParams);
      res.status(200).json(createSuccessResponse());
    } catch (error) {
      throw new Error('Cannot get delete fragment from ID: ' + idParams);
    }
  } else {
    res.status(404).json(createErrorResponse(404, 'The fragment ID ' + idParams + ' not found'));
  }
};
