<template>
  <div>
    <el-card>
      <CategorySelector @handlerCategory="handlerCategory"></CategorySelector>
    </el-card>

    <el-card style="margin-top:20px">
      <div v-show="isShowList">
        <!-- 列表数据展示的内容 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="showAddDiv"
        >添加属性</el-button>
        <el-table :data="attrList" border style="width: 100%">
          <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150"></el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{row,$index}">
              <el-tag
                type="success"
                v-for="(attrValue,index) in row.attrValueList"
                :key="attrValue.id"
              >{{attrValue.valueName}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="{row,$index}">
              <HintButton type="warning" icon="el-icon-edit" title="修改属性" size="mini" @click="showUpdateDiv(row)"></HintButton>
              <HintButton type="danger" icon="el-icon-delete" title="删除属性" size="mini"></HintButton>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-show="!isShowList">
        <!-- 添加和修改的页面 -->
        <el-form :inline="true" :model="attr">
          <el-form-item label="属性名">
            <el-input v-model="attr.attrName" placeholder="请输入属性名"></el-input>
          </el-form-item>
        </el-form>

        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue">添加属性值</el-button>
        <el-button @click="isShowList = true">取消</el-button>

        <el-table :data="attr.attrValueList" style="width: 100%; margin:20px 0" border>
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{row,$index}">
              <el-input v-model="row.valueName" placeholder="请输入属性值" size="mini"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="{row,$index}">
              <HintButton type="danger" icon="el-icon-delete" size="mini" title="删除属性值"></HintButton>
            </template>
          </el-table-column>
        </el-table>

        <el-button type="primary">保存</el-button>
        <el-button @click="isShowList = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],
      isShowList: true,

      attr: {
        attrName: "",
        categoryLevel: 3,
        attrValueList: [],
        categoryId: 0,
      },

      // attr: {
      //   attrName: "string",
      //   attrValueList: [
      //     {
      //       attrId: 0,
      //       id: 0,
      //       valueName: "string",
      //     },
      //   ],
      //   categoryId: 0,
      //   categoryLevel: 0,
      //   id: 0,
      // },
    };
  },
  methods: {
    //addAttrValue点击添加属性值的回调
    addAttrValue() {
      //收集属性值的时候，我们做法是先属性值列表当中添加一个属性值对象
      //然后上面table就会出现一行数据（只不过都是空的）
      this.attr.attrValueList.push({
        attrId: this.attr.id || undefined,
        valueName: "", //属性值已经添加到属性值列表当中了，但是这个属性值的名称是空串为了等待用户去输入
      });
    },



    //点击列表页的添加属性逻辑
    showAddDiv() {
      this.isShowList = false;
      //解决添加取消后再添加数据还在的bug
      this.attr = {
        attrName: "",
        categoryLevel: 3,
        attrValueList: [],
        categoryId: this.category3Id, //收集categoryId 不能在data当中去写
      };
    },


    showUpdateDiv(row){
      this.isShowList = false;
      // this.attr = {...row} //浅拷贝  
      // 对于属性名来说是没问题的，修改添加页面和列表页面的属性不是同一个对象，基本值也不是同一个值，但是对于属性值来说
      //属性值是在一个数组当中的，浅拷贝的时候，不同对象拷贝内部数组还是同一个数组，也就是说两个对象内部属性值的数组是同一个地址
      //在添加页面修改数组其实也是在修改列表页面的数组。因此浅拷贝不行，得换成深拷贝
      this.attr = cloneDeep(row)
    },





    handlerCategory({ categoryId, level }) {
      if (level === 1) {
        //子组件传递过来1级id，证明重新选择了1级分类，需要在父组件当中把原来的23级id及属性列表数组清空
        this.category2Id = "";
        this.category3Id = "";
        this.attrList = [];

        this.category1Id = categoryId;
      } else if (level === 2) {
        this.category3Id = "";
        this.attrList = [];
        this.category2Id = categoryId;
      } else {
        this.category3Id = categoryId;
        this.getAttrList(); //发请求获取属性的数据展示
      }
    },

    async getAttrList() {
      let { category1Id, category2Id, category3Id } = this;
      const result = await this.$API.attr.getList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code === 200) {
        this.attrList = result.data;
      }
    },
  },
};
</script>

