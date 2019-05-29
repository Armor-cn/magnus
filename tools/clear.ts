import { exec } from 'shelljs';
async function clear(){
    await execSync(`find ./demos/**/*.js -exec rm -rf {} \;`)
    await execSync(`find ./demos/**/*.d.ts -exec rm -rf {} \;`)
    await execSync(`find ./libs/**/*.js -exec rm -rf {} \;`)
    await execSync(`find ./libs/**/*.d.ts -exec rm -rf {} \;`)
}
export function execSync(command: string){
    return new Promise((resolve,reject)=>{
        exec(command,()=>{
            resolve();
        })
    })
}
clear();