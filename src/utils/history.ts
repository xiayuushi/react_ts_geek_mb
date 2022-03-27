import { createBrowserHistory } from 'history'

const history = createBrowserHistory()

export default history

// 01、将App组件的从react-router-dom中由导出BrowserRouter改成导出Router（并非重命名改名称，而是改导出的组件）
// 02、在utils/history.ts中使用安装react-router-dom时，内置依赖history插件来创建history对象并导出
// 03、回到App组件中，将创建好的history对象挂载到Router组件的history属性上
// 04、此时，Router+自定义创建的history对象就等同于之前的BrowserRouter，而且还可以在非组件中单独使用这个history对象（例如utils/request中）

// N1、react-router-dom中BrowserRouter或者HashRouter与Router的区别
// N1、BrowserRouter与HashRouter内置history对象，而Router需要自己创建history对象实例
// N1、即，BrowserRouter或者HashRouter的功能 等同于 `Router组件 + history插件创建的history对象` 
// N2、BrowserRouter或者HashRouter只能在组件中使用，不能在非组件中使用，因此进行'改造'的目的，就是为了在非组件中也能使用路由对象
// N3、之所以将BrowserRouter改成 Router+history 的形式，是为了在非组件中也能够使用history对象的属性进行操作
// N3、例如在封装axios实例，响应拦截器中对token失效进行处理时，就会使用到history对象进行跳转
// N4、此处的history对象并非是BrowserRouter提供的，因为useHistory()无法在非组件中使用
// N4、此处的history对象是自己通过安装react-router-dom时的依赖插件history进行封装而成的（配合不带history功能的Router组件，可以实现BrowserRouter的效果）
