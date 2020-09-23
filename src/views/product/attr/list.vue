<template>
  <div>
    <el-card>
      <CategorySelector @handlerCategory="handlerCategory"></CategorySelector>
    </el-card>

    <el-card style="margin-top:20px">
      <!-- 列表数据展示的内容 -->
      列表数据
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Attr',
  data(){
    return {
      category1Id:'',
      category2Id:'',
      category3Id:'',
      attrList:[]
    }
  },
  methods:{
    handlerCategory({categoryId,level}){
      if(level === 1){

        this.category2Id = ''  
        this.category3Id = ''  
        this.attrList = []

        this.category1Id = categoryId
      }else if(level === 2){
        this.category3Id = ''  
        this.attrList = []
        this.category2Id = categoryId
        
      }else{
        this.category3Id = categoryId
        this.getAttrList() //发请求获取属性的数据展示
      }
    }
  }
}
</script>

