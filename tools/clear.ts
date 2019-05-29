import rimraf from 'rimraf';
async function clear() {
    rimraf(`{demos,libs}/**/*.{js,d.ts}`,()=>{
        console.log(`rimraf`)
    })
}
clear();