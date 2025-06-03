import * as fs from 'fs/promises';
import * as path from 'path';
import { getProjectRoot, buildFileTree } from "../../src/utilities/file_structure";

jest.mock('fs/promises');


describe("File Structure Utility", () => {
    it("should return the project root", () => {
        const result = getProjectRoot();

        expect(result).toEqual('/mock/project/root')
    });

    beforeEach(() => {
    jest.resetAllMocks();
  });

  it('builds a file tree from directory entries', async () => {
    // Mock directory entries: one file and one folder
    (fs.readdir as jest.Mock)
      .mockImplementationOnce(() =>
        Promise.resolve([
          { name: 'file1.txt', isDirectory: () => false },
          { name: 'folder1', isDirectory: () => true },
        ])
      )
      .mockImplementationOnce(() =>
        Promise.resolve([
          { name: 'nestedFile.txt', isDirectory: () => false },
        ])
      );

    // Mock stat to return a file size
    (fs.stat as jest.Mock).mockResolvedValue({ size: 1234 });

    const root = '/mock/project/root';
    const result = await buildFileTree(root, root);

    expect(fs.readdir).toHaveBeenCalled();
    expect(fs.stat).toHaveBeenCalled();

    expect(result).toEqual([
      {
        name: 'file1.txt',
        path: path.join(root, 'file1.txt'),
        relativePath: 'file1.txt',
        isDirectory: false,
        fileType: 'txt',
        size: 1234,
      },
      {
        name: 'folder1',
        path: path.join(root, 'folder1'),
        relativePath: 'folder1',
        isDirectory: true,
        fileType: 'directory',
        children: [
          {
            name: 'nestedFile.txt',
            path: path.join(root, 'folder1', 'nestedFile.txt'),
            relativePath: path.join('folder1', 'nestedFile.txt'),
            isDirectory: false,
            fileType: 'txt',
            size: 1234,
          },
        ],
      },
    ]);
  });
});