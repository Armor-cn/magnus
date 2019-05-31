import { build } from './build';
import glob from 'glob';
export async function bootstrap(_glob: string, output: string) {
    glob(_glob, {}, (err, files) => {
        files.map(path => {
            if (path.endsWith('.ts')) {
                build(path, output);
            }
        })
    });
}
