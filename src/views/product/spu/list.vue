<template>
  <div>
    <el-card>
      <CategorySelector
        @handlerCategory="handlerCategory"
        :isShowList="isShowList"
      ></CategorySelector>
    </el-card>

    <el-card style="margin-top: 20px">
      <div v-show="!isShowSpuForm && !isShowSkuForm">
        <el-button type="primary" icon="el-icon-plus" @click="showAddSpuForm">添加SPU</el-button>
        <el-table :data="spuList" border style="width: 100%">
          <el-table-column type="index" label="序号" align="center" width="80">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <HintButton
                icon="el-icon-plus"
                type="primary"
                size="mini"
                title="添加SKU"
                @click="showAddSkuForm(row)"
              ></HintButton>
              <HintButton
                icon="el-icon-edit"
                type="warning"
                size="mini"
                title="修改SPU"
                @click="showUpdateSpuForm(row)"
              ></HintButton>
              <HintButton
                icon="el-icon-info"
                type="info"
                size="mini"
                title="查看SPU所有的SKU"
              ></HintButton>
              <HintButton
                icon="el-icon-delete"
                type="danger"
                size="mini"
                title="删除SPU"
              ></HintButton>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="getSpuList"
          style="text-align: center"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout=" prev, pager, next, jumper, ->, sizes,total"
          :total="total"
        >
        </el-pagination>
      </div>

      <!-- <SpuForm v-show="isShowSpuForm" :visible="isShowSpuForm" @update:visible="isShowSpuForm = $event"></SpuForm> -->
      <SpuForm v-show="isShowSpuForm" :visible.sync="isShowSpuForm"></SpuForm>

      <SkuForm v-show="isShowSkuForm"></SkuForm>


    </el-card>
  </div>
</template>

<script>
import SkuForm from '@/views/product/components/SkuForm'
import SpuForm from '@/views/product/components/SpuForm'
export default {
  name: "Spu",
  components:{
    SkuForm,
    SpuForm
  },
  data() {
    return {
      //这个数据就是用来控制三级分类可操作性的
      isShowList: true,


      category1Id: "",
      category2Id: "",
      category3Id: "",
      spuList: [],
      page: 1,
      limit: 3,
      total: 0,

      isShowSpuForm:false,
      isShowSkuForm:false,

    };
  },
  methods: {


    //点击添加sku按钮逻辑
    showAddSkuForm(row){
      this.isShowSkuForm = true
    },
    // 点击修改spu按钮逻辑
    showUpdateSpuForm(row){
      this.isShowSpuForm = true
    },
    //点击添加spu按钮逻辑
    showAddSpuForm(){
      this.isShowSpuForm = true
    },

    handlerCategory({ categoryId, level }) {
      if (level === 1) {
        this.category2Id = "";
        this.category3Id = "";
        this.spuList = [];
        this.category1Id = categoryId;
      } else if (level === 2) {
        this.category3Id = "";
        this.spuList = [];
        this.category2Id = categoryId;
      } else {
        this.category3Id = categoryId;
        this.getSpuList();
      }
    },
    async getSpuList(pagee = 1) {
      this.page = pagee;
      let { page, limit, category3Id } = this;
      const result = await this.$API.spu.getList(page, limit, category3Id);
      if (result.code === 200) {
        this.spuList = result.data.records;
        this.total = result.data.total;
      }
    },

    handleSizeChange(size) {
      this.limit = size;
      this.getSpuList(this.page);
    },
  },
};
</script>

