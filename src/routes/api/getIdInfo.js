const { createSuccessResponse, createErrorResponse } = require('../../response');

const { Fragment } = require('../../model/fragment');

const path = require('path');

module.exports = async (req, res) => {
  //Get a list of fragment id by specific user id
  const fragmentList = await Fragment.byUser(req.user);
  let pathObj = path.parse(req.params.id);
  let isValidId = false;

  //Check if we got valid id on our database
  fragmentList.forEach((id) => {
    if (pathObj.name === id) {
      isValidId = true;
    }
  });

  //Return metadata if id is valid
  if (isValidId) {
    try {
      const fragment = await Fragment.byId(req.user, pathObj.name);

      res.status(200).json(
        createSuccessResponse({
          fragment: fragment,
        })
      );
    } catch (error) {
      throw new Error('Cannot get metadata fragment from invalid ID');
    }
  } else {
    res.status(404).json(createErrorResponse(404, 'ID not found'));
  }
};
