const { randomUUID } = require('crypto');

// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

//Create valid content-type header:
// const validContentType = [
//   'text/plain',
//   'text/plain; charset=utf-8',
//   'text/markdown',
//   'text/html',
//   'application / json',
//   'image/png',
//   'image/jpeg',
//   'image/webp',
//   'image/gif',
// ];

class Fragment {
  constructor({
    id = randomUUID(),
    ownerId,
    created = new Date().toISOString(),
    updated = new Date().toISOString(),
    type,
    size = 0,
  }) {
    // TODO
    if (typeof ownerId !== 'string') {
      throw new Error('Require owner ID');
    }

    if (typeof type !== 'string') {
      throw new Error('Require type of metadata');
    }

    if (typeof size !== 'number' || size < 0) {
      throw new Error('Size must be a number and positive');
    }

    if (type !== 'text/plain' && type !== 'text/plain; charset=utf-8') {
      throw new Error('Invalid content-type');
    }

    //Assign values
    this.id = id;
    this.ownerId = ownerId;
    this.created = created;
    this.updated = updated;
    this.type = type;
    this.size = size;
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    // TODO
    return await listFragments(ownerId, expand);
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    // TODO
    const fragment = await readFragment(ownerId, id);

    if (fragment) {
      return fragment;
    } else {
      throw new Error('No fragment data found');
    }
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise
   */
  static delete(ownerId, id) {
    // TODO
    return deleteFragment(ownerId, id);
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise
   */
  save() {
    this.updated = new Date().toISOString();
    return writeFragment(this);
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  getData() {
    // TODO
    return readFragmentData(this.ownerId, this.id);
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise
   */
  async setData(data) {
    // TODO
    if (!Buffer.isBuffer(data)) {
      throw new Error('Data must be a Buffer object');
    }

    this.size = data.length;
    //this.updated = new Date().toISOString();
    //TODO: Assignment 1 feedback: save data
    this.save();

    return await writeFragmentData(this.ownerId, this.id, data);
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    if (this.type === 'text/plain' || this.type === 'text/plain; charset=utf-8') {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    // TODO
    return ['text/plain'];
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    if (value === 'text/plain' || value === 'text/plain; charset=utf-8') {
      return true;
    } else {
      return false;
    }
  }
}

module.exports.Fragment = Fragment;
