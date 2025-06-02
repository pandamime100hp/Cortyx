import { getProjectRoot } from "../../src/utilities/file_structure";


describe("File Structure Utility", () => {
    it("should return the project root", () => {
        jest.mock('vscode', () => ({
            workspace: {
                workspaceFolders: [{ uri: { fsPath: '/project/root' } }]
            }
        }));

        const result = getProjectRoot();

        expect(result).toEqual('/mock/project/root')
    });
});