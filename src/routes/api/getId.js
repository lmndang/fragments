const { createErrorResponse } = require('../../response');

const { Fragment } = require('../../model/fragment');

const path = require('path');

module.exports = async (req, res) => {
  const fragmentList = await Fragment.byUser(req.user);
  const pathObj = path.parse(req.params.id);

  let isHtmlExtension = false;
  let isMarkdownExtension = false;
  let isIDValid = false;

  //Check if the id contain extension
  if (pathObj.ext) {
    //Double check if id contain supported extension
    if (pathObj.ext === '.html') {
      isHtmlExtension = true;
    } else if (pathObj.ext === '.md') {
      isMarkdownExtension = true;
    }
    //Return 415 Error if not supported extension
    else {
      res.status(415).json(createErrorResponse(415, 'Extension not supported'));
      return;
    }
  }

  //Check if ID is exist
  fragmentList.forEach((id) => {
    if (pathObj.name === id) {
      isIDValid = true;
    }
  });

  if (isIDValid) {
    try {
      const fragment = await Fragment.byId(req.user, pathObj.name);
      const text = await fragment.getData();

      //Return html if extension define
      if (isHtmlExtension) {
        res.send('<h1>' + text + '</h1>');
      }

      //Return markdown if .md extension define
      if (isMarkdownExtension) {
        //var md = require('markdown-it')();
        //var result = md.render(text);
        res.send('Support the markdown extension');
      }

      //Return text file if no extensions define
      if (!isHtmlExtension && !isMarkdownExtension) {
        res.setHeader('Content-type', 'text/plain');
        res.setHeader('Content-disposition', 'attachment; filename=fragment.txt');
        res.send(text);
      }
    } catch (error) {
      throw new Error('Cannot get data from invalid Id');
    }
  } else {
    res
      .status(404)
      .json(createErrorResponse(404, 'The fragment ID ' + pathObj.name + ' not found'));
  }
};
