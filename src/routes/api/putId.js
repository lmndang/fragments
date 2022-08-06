//Refactor to Use the response.js Functions
const { createSuccessResponse, createErrorResponse } = require('../../response');

const { Fragment } = require('../../model/fragment');

const contentType = require('content-type');

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
      const fragment = await Fragment.byId(req.user, idParams);

      if (contentType.parse(req).type !== fragment.type) {
        res
          .status(400)
          .json(createErrorResponse(400, 'Cannot change the type of fragment ID: ' + idParams));
      } else {
        //Because using the DynamoDB, the getDat function get lost
        //Recreate Javascript Object to get data
        const fragmentObj = new Fragment({
          id: fragment.id,
          ownerId: fragment.ownerId,
          created: fragment.created,
          updated: fragment.updated,
          type: fragment.type,
          size: fragment.size,
        });
        await fragmentObj.setData(Buffer.from(req.body));

        res.status(200).json(createSuccessResponse({ fragment }));
      }
    } catch (error) {
      throw new Error(error);
    }
  } else {
    res.status(404).json(createErrorResponse(404, 'The fragment ID ' + idParams + ' not found'));
  }
};
