// src/routes/api/get.js
const { Fragment } = require('../../model/fragment');

//Refactor to Use the response.js Functions
const { createSuccessResponse } = require('../../response');

/**
 * Get a list of fragments for the current user
 */
module.exports = async (req, res) => {
  // TODO: this is just a placeholder to get something working...

  let expand = req.query.expand;
  let isExpand = false;

  if (expand === '1') {
    isExpand = true;
  }

  res.status(200).json(
    createSuccessResponse({
      fragments: await Fragment.byUser(req.user, isExpand),
    })
  );
};
