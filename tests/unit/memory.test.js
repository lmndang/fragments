const {
  writeFragment,
  readFragment,
  writeFragmentData,
  readFragmentData,
  listFragments,
  deleteFragment,
} = require('../../src/model/data/memory/index');

describe('fragments memory test', () => {
  test("Write fragment's metadata, return nothing", async () => {
    let metadata = {
      id: 'WRITE_METADATA',
      ownerId: '001',
      created: '2021-11-02T15:09:50.403Z',
      updated: '2021-11-02T15:09:50.403Z',
      type: 'text/plain',
      size: 256,
    };
    const result = await writeFragment(metadata);
    expect(result).toBe(undefined);
  });

  test("Read fragment's metadata, return what we write in to the database", async () => {
    let metadata = {
      id: 'READ_METADATA',
      ownerId: '002',
      created: '2021-11-02T15:09:50.403Z',
      updated: '2021-11-02T15:09:50.403Z',
      type: 'text/plain',
      size: 256,
    };
    await writeFragment(metadata);
    const result = await readFragment(metadata.ownerId, metadata.id);
    expect(result).toEqual(metadata);
  });

  test("Write fragment's data, return nothing", async () => {
    let data = {
      id: 'WRITE_DATA',
      ownerId: '003',
      value: '00001 00002 00003',
    };
    const result = await writeFragmentData(data.ownerId, data.id, data.value);
    expect(result).toBe(undefined);
  });

  test("Read fragment's data, return what we write in to the database", async () => {
    let data = {
      id: 'READ_DATA',
      ownerId: '004',
      value: '00001 00002 00003',
    };
    await writeFragmentData(data.ownerId, data.id, data.value);
    const result = await readFragmentData(data.ownerId, data.id);
    expect(result).toEqual(data.value);
  });

  test('Get a list of metadata fragments (ObjectID or Expand Object)', async () => {
    let metadata = {
      id: 'LIST_METADATA_01',
      ownerId: '005',
      created: '2021-11-02T15:09:50.403Z',
      updated: '2021-11-02T15:09:50.403Z',
      type: 'text/plain',
      size: 256,
    };

    let metadata2 = {
      id: 'LIST_METADATA_02',
      ownerId: '005',
      created: '2021-11-02T15:09:50.403Z',
      updated: '2021-11-02T15:09:50.403Z',
      type: 'text/plain',
      size: 256,
    };
    await writeFragment(metadata);
    await writeFragment(metadata2);
    const result = await listFragments('005');
    const expandResult = await listFragments('005', true);
    expect(result).toEqual(['LIST_METADATA_01', 'LIST_METADATA_02']);
    expect(expandResult).toEqual([metadata, metadata2]);
  });

  test('Delete all metadata and data of fragments', async () => {
    let metadata = {
      id: 'DELETE',
      ownerId: '006',
      created: '2021-11-02T15:09:50.403Z',
      updated: '2021-11-02T15:09:50.403Z',
      type: 'text/plain',
      size: 256,
    };
    let data = {
      id: 'DELETE',
      ownerId: '006',
      value: '00001 00002 00003',
    };
    await writeFragment(metadata);
    await writeFragmentData(data.ownerId, data.id, data.value);
    await deleteFragment('006', 'DELETE');
    expect(await readFragment(metadata.ownerId, metadata.id)).toEqual(undefined);
    expect(await readFragmentData(data.ownerId, data.id)).toEqual(undefined);
  });
});
