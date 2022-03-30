// axios内置的AxiosResponse的泛型参数（实参）
// 传入给axios的get或者post或者其他请求的泛型，如axios.post<ApiResPonseType<T>>
// 定义了两个字段，则这两个字段就会有完整的属性链式提示
// T的类型可以调用接口时根据返回数据字段去定义，axios的方法使用泛型后，后续在组件中使用时就会有相应的属性提示
export type ApiResponseType<T> = {
  message: string,
  data: T
}

export interface TokenDataType {
  token: string,
  refresh_token: string
}

export type LoginParamsType = {
  mobile: string,
  code: string
}

export type UserType = {
  id: string,
  name: string,
  photo: string,
  art_count: number,
  fans_count: number,
  follow_count: number,
  like_count: number,
}

export type UserProfileType = {
  gender: number,
  photo: string,
  id: string,
  mobile: string,
  name: string,
  intro: string,
  birthday: string,
}

export type ChatListType = {
  type: 'robot' | 'user',
  text: string
}[]

export type ChannelType = {
  id: number,
  name: string
}

export type AddChannelResType = {
  id: number,
  seq: number
}

// 01、当前文件用于存放除store之外的，会在多个组件中用到的数据的声明
// 02、ApiResponseType是根据axios内置的AxiosResponse类型封装而成的自定义响应类型
// 02、因为当前接口返回的数据都有message以及data字段，为了在通过axios拿到数据使用时能够有属性提示（定义了几个字段，这几个字段就会有属性提示）
// 02、光标移入axios方法返回数据时可看到axios自身内置的AxiosResponse类型，该类型接收泛型参数
// 02、因此根据返回数据定义相应的数据字段类型，作为AxiosResponse类型的泛型参数传入，后续使用axios请求回来的数据时就有链式属性提示了

// 自定义axios请求方法的响应类型流程
// st1、光标移入axios请求回来的数据上查看内置的AxiosResponse类型
// st1、例如 const res = await axios.get(...)，此时光标移到res上可看到AxiosResponse类型（res返回数据的类型，即得到返回数据的方法的类型，如axios.get）
// st2、AxiosResponse类型（发请求时得到返回数据的方法）接收两个泛型参数，只需根据res返回的数据定义相应的数据字段及对应的类型，作为AxiosResponse类型的第一个泛型参数
// st2、例如：axios.get<Xxx, any>  此时Xxx就是根据res返回数据定义的字段及字段类型
// st3、观察res返回数据，如果某个字段是固定不变的数据类型，而其他字段的数据类型有所不同，则可以再次进行封装（将有不同的类型的字段定义为泛型）
// st3、例如：当前项目所有res返回数据中都有message及data字段，且message都是字符串，而data有可能是对象有可能是数组，因此可以将data的数据类型提取为泛型
// st3、例如：type Xxx<T> = {message: string, data: T} 后续根据具体的data的类型，将泛型参数T具体化
// st4、在得到res返回数据的请求方法中使用AxiosResponse泛型，以及传入泛型参数
// st4、例如：const res = await axios.get<Xxx<{具体字段1:类型, 具体字段2：类型 }>>

// axios的AxiosError类型
// 01、使用try-catch去捕获错误时，因为捕获的错误的情况很多，并非全是axios报错，catch形参e内置是any或者unknown类型且不允许显式的指定类型，因此使用形参e时不会有属性提示
// 02、在try-catch中，也不允许直接为catch形参显示的指定类型（显式的指定为any或者unknown也不被允许）
// 02、即 `try{...}catch(e:xxx){...}` 这种为e直接指定类型的方式都是不被允许的
// 03、做登录请求失败的逻辑时，为了有更加明确的属性提示，可以使用类型断言将catch形参e断言为axios的AxiosError类型，以此来获取axios报错信息
// 03、例如：`try{...}catch(e){ const xxx = e as AxiosError }` 后续就可以通过变量xxx来获取axios报错信息（此时使用xxx时有链式属性提示）
// 04、为了有更加明确的axios错误类型提示，可以给AxiosError传入泛型参数

// 在组件try-catch逻辑中，将catch形参e断言为AxiosError类型，并为该类型传入泛型参数的两种方式
// 01、方式1：断言e的类型为AxiosError之前，`console.dir(res)`查看报错信息
// 02、方式2：断言e的类型为AxiosError之后，变量接收的返回的报错信息数据进行定义，通常是一个返回错误信息的字段，只需要定义该字段及对应的字段类型即可
// 02、例如：`try{...}catch(e){ const xxx = e as AxiosError<{ message: string }> }` 后续通过变量xxx可以一路链式点选属性到message拿到axios报错信息

// 在axios响应拦截器中，出错逻辑形参error的类型一定是AxiosError类型，因此以上定义泛型参数的两种方式都适用
// 可以直接显式的为响应拦截器出错的回调形参error指定AxiosError类型，也可以使用类型断言


// N1、通用的类型数据通常会被单独存放于某个.d.ts文件中，以便进行管理，随用随导
// N2、如果响应数据的数据字段完全不一样，则可以将自定义响应类型的泛型直接放到那个请求所在的文件中，不必放到通用类型文件中
// N3、在发请求时，为axios的请求方法提供自定义的响应类型可以获取完整的链式属性提示
// N4、可以根据接口文档返回数据格式定义（或者调用一次接口拿到数据去定义）类型作为请求方法的泛型参数
// N5、如果在请求前指定了响应数据类型并传入了具体的泛型参数，则在axios响应拦截器中就不要对response数据进行简化取值处理，否则在redux的action拿数据时会有问题
// N6、登录出错的逻辑及AxiosError类型的使用，通常会在axios响应拦截器中进行统一处理，这样子可以避免在不同组件中使用try-catch处理相同的登录错误
// N7、try-catch捕获的错误情况很多，不能显式的指定类型，只能进行类型断言，断言错误为AxiosError类型（断言为AxiosError类型后，无法处理其他非axios请求的类型错误，要慎用）
// N8、axios响应拦截器中，既可以使用类型断言，也可以显式的指定AxiosError类型，是比较推荐的做法，另外也不影响组件中再次使用try-catch捕获其他非axios请求的错误
// N9、推荐使用axios响应拦截器中处理登录失败的请求，这样子可以避免重复在不同组件中写try-catch处理登录失败
