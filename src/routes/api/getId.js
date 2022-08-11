const { createErrorResponse } = require('../../response');

const { Fragment } = require('../../model/fragment');

const path = require('path');
const md = require('markdown-it')();

module.exports = async (req, res) => {
  const fragmentList = await Fragment.byUser(req.user);
  const pathObj = path.parse(req.params.id);

  let isIDValid = false;

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
            res.setHeader('Content-Type', 'text/plain');
            res.send(text);
            return;
          } else {
            res.status(415).json(createErrorResponse(415, 'Extension not supported'));
            return;
          }
        }

        res.setHeader('Content-Type', 'text/plain');
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

      //text/html support .html, .txt extension
      if (fragment.type === 'text/html') {
        if (pathObj.ext) {
          if (pathObj.ext === '.html') {
            res.send(data);
            return;
          } else if (pathObj.ext === '.txt') {
            res.setHeader('Content-Type', 'text/plain');
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

      //application/json support .json, .txt extension
      if (fragment.type === 'application/json') {
        if (pathObj.ext) {
          if (pathObj.ext === '.json') {
            res.json(JSON.parse(data.toString()));
            return;
          } else if (pathObj.ext === '.txt') {
            res.send(data.toString());
            return;
          } else {
            res.status(415).json(createErrorResponse(415, 'Extension not supported'));
            return;
          }
        }

        res.json(JSON.parse(data.toString()));
        return;
      }

      //IMAGE
      //Convert image buffer to image Base64
      // const toBase64 = (arrBuffer) => {
      //   return btoa(arrBuffer.reduce((data, byte) => data + String.fromCharCode(byte), ''));
      // };

      //Return image link
      if (
        fragment.type === 'image/png' ||
        fragment.type === 'image/jpeg' ||
        fragment.type === 'image/webp' ||
        fragment.type === 'image/gif'
      ) {
        res.send(`data:${fragment.type};base64,${data}`);
        return;
      }
    } catch (error) {
      throw new Error(error);
    }
  } else {
    res
      .status(404)
      .json(createErrorResponse(404, 'The fragment ID ' + pathObj.name + ' not found'));
  }
};
