## Angular 

### 安装
```
yarn add @notadd/magnus-ng
```

### 使用

```ts
import { MagnusNgModule, MagnusNg } from '@notadd/magnus-ng'
@NgModule({
    imports: [
        // magnus client暴露的接口地址
        MagnusNgModule.create({
            uri: 'http://localhost:4200/api'
        })
    ]
})
export class AppModule{}


@Injectable()
export class DemoInjectable{
    constructor(public client: MagnusNg){}

    getData(){
        return this.client.query({
            ...
        })
    }
}
```
