import { getProjectRoot } from "../../src/utilities/file_structure";


jest.mock('vscode', () => ({
    workspace: {
        workspaceFolders: [{ uri: { fsPath: '/project/root' } }]
    }
}));

describe("File Structure Utility", () => {
    it("should return the project root", () => {
        const result = getProjectRoot();

        expect(result).toEqual('/project/root')
    });
});