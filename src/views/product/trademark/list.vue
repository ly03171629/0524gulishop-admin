<template>
  <div>
    <el-button type="primary" icon="el-icon-plus">添加</el-button>

    <el-table style="width: 100%;margin:20px 0" border stripe>
      <el-table-column type="index" width="80" label="序号" align="center"></el-table-column>
      <el-table-column prop="prop" label="品牌名称" width="width"></el-table-column>
      <el-table-column prop="prop" label="品牌LOGO" width="width"></el-table-column>
      <el-table-column prop="prop" label="操作" width="width"></el-table-column>
    </el-table>

    <!--  @size-change="handleSizeChange"
      @current-change="handleCurrentChange" -->
    <el-pagination
      style="text-align:center"
      :current-page="1"
      :page-sizes="[10, 20, 50]"
      :page-size="10"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="100">
    </el-pagination>

  </div>
</template>

<script>
export default {
  name: "Trademark",
  data(){
    return {
      page:1,
      limit:3,
      // trademarkInfo:{},
      trademarkList:[],
      total:0
    }
  },
  mounted(){
    this.getTrademarkList()
  },
  methods:{
    async getTrademarkList(){
      const result = await this.$API.trademark.getPageList(this.page,this.limit)
      if(result.code === 200){
        // this.trademarkInfo = result.data
        this.trademarkList = result.data.records
        this.total = result.data.total
      }
    }
  }
};
</script>

<style scoped>
</style>
