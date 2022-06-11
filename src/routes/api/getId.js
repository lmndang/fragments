const { createErrorResponse } = require('../../response');

const { Fragment } = require('../../model/fragment');

module.exports = async (req, res) => {
  const fragmentList = await Fragment.byUser(req.user);
  let isIDValid = false;
  let idConverted = req.params.id;
  let isHtmlExtension = false;

  //Check if id contain extension
  if (idConverted.includes('.')) {
    //Check if id contain supported extension
    if (idConverted.includes('.html')) {
      isHtmlExtension = true;
    }
    //Return 415 Error if not supported extension
    else {
      res.status(415).json(createErrorResponse(415, 'Extension not supported'));
      return;
    }
  }

  //Get id
  if (isHtmlExtension) {
    idConverted = req.params.id.replace('.html', '');
  }

  //Check if ID is exist
  fragmentList.forEach((id) => {
    if (idConverted === id) {
      isIDValid = true;
    }
  });

  //Return if Id is valid
  if (isIDValid) {
    const fragment = await Fragment.byId(req.user, idConverted);
    const text = await fragment.getData();

    //Return text file if no extensions define
    if (!isHtmlExtension) {
      res.setHeader('Content-type', 'text/plain');
      res.setHeader('Content-disposition', 'attachment; filename=fragment.txt');
      res.send(text);
    }
    //Return html if extension define
    else {
      res.send('<h1>' + text + '</h1>');
    }
  } else {
    res.status(404).json(createErrorResponse(404, 'The fragment ID ' + idConverted + ' not found'));
  }
};
