import { Config } from '../../src/utilities/config';


describe('Config', () => {
    const config: Config = new Config();

    jest.mock('../../src/utilities/file_structure', () => ({
        getProjectRoot: jest.fn(() => '/mock/project/root')
    }));

    it('should create an empty config', () => {
        const result = config.load();
        expect(result).toEqual(Promise.resolve({}));
    });

    it('should set the configPath based on mocked root', () => {
        // @ts-ignore - accessing private field for test
        expect(config['configPath']).toContain('\\mock\\project\\root\\.cortyx\\config.json');
    });
});