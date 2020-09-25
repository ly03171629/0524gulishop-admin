import request from '@/utils/request'


export default {
  // DELETE /admin/product/baseTrademark/remove/{id}
  // 删除BaseTrademark
  delete(id){
    //axios的函数写法就是写配置项
    //axios的对象写法要看请求
      // 请求方式都是对象.后面就是请求方式
      // get post put delete都是请求方式也是函数
      // get post put delete函数的参数要看请求不同而不同
        // 第一个参数都是请求路径
        // 第二个如果是post或者put 那么第二个参数是请求体参数（data），第三个参数代表的是配置对象
        // 如果不是post或者put 第二个参数是一个配置对象
    return request.delete(`/admin/product/baseTrademark/remove/${id}`)
  },

  //添加和修改都要给后端发送数据过去
  //而且数据格式非常像   添加的时候没有id  修改的时候有id
  //添加的时候我们添加的是数据库原来不存在的东西，id是后端添加数据库的时候才会生成的
  //修改的时候我们修改的是从数据库获取的数据，id存在
  // POST /admin/product/baseTrademark/save
  // 新增BaseTrademark
  // PUT /admin/product/baseTrademark/update
  // 修改BaseTrademark
  addOrUpdate(trademark){
    if(trademark.id){
      return request.put('/admin/product/baseTrademark/update',trademark)
    }else{
      return request.post('/admin/product/baseTrademark/save',trademark)
    }
  },


  // GET /admin/product/baseTrademark/{page}/{limit}
  // 分页列表
  getPageList(page,limit){
    return request.get(`/admin/product/baseTrademark/${page}/${limit}`)
  },


  // GET /admin/product/baseTrademark/getTrademarkList   所有的品牌列表
  getList(){
    return request.get('/admin/product/baseTrademark/getTrademarkList')
  }
}
