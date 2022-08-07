const { createErrorResponse } = require('../../response');

const { Fragment } = require('../../model/fragment');

const path = require('path');
const md = require('markdown-it')();

module.exports = async (req, res) => {
  const fragmentList = await Fragment.byUser(req.user);
  const pathObj = path.parse(req.params.id);

  //let isHtmlExtension = false;
  //let isMarkdownExtension = false;
  let isIDValid = false;

  //Check if the id contain extension
  // if (pathObj.ext) {
  //   //Double check if id contain supported extension
  //   if (pathObj.ext === '.html') {
  //     isHtmlExtension = true;
  //   } else if (pathObj.ext === '.md') {
  //     isMarkdownExtension = true;
  //   }
  //   //Return 415 Error if not supported extension
  //   else {
  //     res.status(415).json(createErrorResponse(415, 'Extension not supported'));
  //     return;
  //   }
  // }

  //Check if ID is exist
  fragmentList.forEach((id) => {
    if (pathObj.name === id) {
      isIDValid = true;
    }
  });

  if (isIDValid) {
    try {
      const fragment = await Fragment.byId(req.user, pathObj.name);

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

      const data = await fragmentObj.getData();

      //text/plain support .txt extension
      if (fragment.type === 'text/plain') {
        const text = data.toString();

        if (pathObj.ext) {
          if (pathObj.ext === '.txt') {
            res.send(text);
            return;
          } else {
            res.status(415).json(createErrorResponse(415, 'Extension not supported'));
            return;
          }
        }

        res.send(text);
        return;
      }

      //text/markdown support .md,.html,.txt extensions
      if (fragment.type === 'text/markdown') {
        if (pathObj.ext) {
          if (pathObj.ext === '.md') {
            res.send(data);
            return;
          } else if (pathObj.ext === '.html') {
            let result = md.render(data.toString());
            res.send(result);
            return;
          } else if (pathObj.ext === '.txt') {
            res.send(data.toString());
            return;
          } else {
            res.status(415).json(createErrorResponse(415, 'Extension not supported'));
            return;
          }
        }

        res.send(data);
        return;
      }

      //Return json if type is "application/json"
      if (fragment.type === 'application/json') {
        res.json(JSON.parse(data.toString()));
        return;
      }

      if (fragment.type === 'image/png') {
        //const b64 = text.toString();
        res.send(`data:${fragment.type};base64,${data}`);
        return;
      }

      //Return html if extension define
      // if (isHtmlExtension) {
      //   res.send('<h1>' + text + '</h1>');
      // }

      //Return markdown if .md extension define
      // if (isMarkdownExtension) {
      //   var result = md.render(text.toString());

      //   res.send(result);
      // }

      //Return text file if no extensions define
      // if (!isHtmlExtension && !isMarkdownExtension) {
      //   res.setHeader('Content-type', 'text/plain');
      //   res.setHeader('Content-disposition', 'attachment; filename=fragment.txt');
      //   res.send(text);
      // }
    } catch (error) {
      throw new Error(error);
    }
  } else {
    res
      .status(404)
      .json(createErrorResponse(404, 'The fragment ID ' + pathObj.name + ' not found'));
  }
};
