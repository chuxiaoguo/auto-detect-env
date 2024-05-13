# detect-env

## 描述
`detect-env` 是一个轻量级的Node.js插件，用于检测生产环境的配置文件，对存在异常的配置抛出异常或终止进程，保证production环境变量配置的安全性与准确性。


## 安装
```bash
# local
npm install detect-env
# Or using Yarn
yarn add detect-env
# Or using pnpm
pnpm install detect-env

# global
npm install -g detect-env
```

## 用法
1、在项目中集成package.json文件中添加以下脚本
```javascript
// package.json
{
  scripts: {
    "detect-env": npm run detect-env
  }
}
```
2、在终端中执行
```bash
npm run detect-env
```
3、在项目中使用（cjs）
```javascript
const { startToDetecting } = require('detect-env');
startToDetecting().then((res) => console.log(res)).catch((err) => console.log(err));
```

当然你也可以携带参数用于改变配置，参数api在配置模块中介绍
```bash
npm run detect-env -l error
```

## 配置
创建一个`detect-env.json`文件，配置文件内容如下：
```json
{
  "exclude": ["https://127.0.0.1:8848"],
  "sensitiveWord": ["oasis"],
  "ignoreWord": ["DEV_API_URL", "fat", "qa"],
  "devFilePath": ".env.fat",
  "prodFilePath": ".env.prd",
  "level": "warn"
}
```

| config key          | 字段说明         | commander key        | 默认值          |
| ------------ | ------------ | ------------ | ------------ |
| exclude | 添加需要忽略的配置(可以是key,也可以是value) | -e | [] |
| sensitiveWord | 添加需要校验的敏感词 | -s | [] |
| ignoreWord | 加需要忽略的敏感词 | -i | [] |
| devFilePath | 添加dev环境的路径配置 | -dev | .env.development |
| prodFilePath | 添加prod环境的路径配置 | -prod |.env.production |
| level| 添加告警等级 <br> @enum {'info'} 表示不会退出进程，只会打印警告信息 <br> @enum {'warn'} 表示不会退出进程，只有检测到敏感词或相同的内容时才会退出进程，并打印警告信息 <br> @enum {'error'} 表示检测到异常项（空配置、敏感词、相同的内容）会退出进程，并打印错误信息 | -l | "warn" |
