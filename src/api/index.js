export {default as login} from './acl/login' 
export {default as user} from './acl/user'
export {default as role} from './acl/role'
export {default as permission} from './acl/permission'
export {default as category} from './category'
export {default as clientUser} from './clientUser'
export {default as order} from './order'
export {default as trademark} from './product/trademark'
export {default as attr} from './product/attr'
export {default as spu} from './product/spu'
export {default as sku} from './product/sku'



// export {default as order} from './order'

//理解
// import {default as order} from './order'
// export order

// export {default as clientUser} from './clientUser'
//理解
// import {default as clientUser} from './clientUser'
// export clientUser



// 最终分别暴露的两个对象
// order = {
//   /*
//   获取订单分页列表(带搜索)
//   */
//   getPageList(page, limit, searchObj) {
//     return request({
//       url: `${api_name}/${page}/${limit}`,
//       method: 'get',
//       params: searchObj // url查询字符串或表单键值对
//     })
//   }
// }


// clientUser = {
//   /* 
//   获取会员分页列表(带搜索)
//   */
//   getPageList(page, limit, searchParams) {
    
//     return request({
//       url: `/admin/user/${page}/${limit}`,
//       method: 'GET',
//       params: searchParams
//     })
//   }
// }



//引入到同一个文件然后一起暴露打包为一个对象，不同文件中无法做到
// import * as API from '@/api'
// API ={
//   order,
//   clientUser
// }

// API.clientUser.getPageList()







/* {
  login: {},
  user: {},
  role,
  permission,
  category,
  clientUser,
  order,
  trademark,
  attr,
  spu,
  sku
} */