<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="showAddDialog">添加</el-button>

    <el-table :data="trademarkList" style="width: 100%;margin:20px 0" border stripe>
      <el-table-column type="index" width="80" label="序号" align="center"></el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width"></el-table-column>
      <el-table-column label="品牌LOGO" width="width">
        <template slot-scope="{row,$index}">
          <img :src="row.logoUrl" alt style="width:100px;height:60px" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="width">
        <template slot-scope="{row,$index}">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="showUpdateDialog(row)"
          >修改</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTrademark(row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="getTrademarkList"
      style="text-align:center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
    ></el-pagination>

    <!--增加和修改的dialog -->
    <el-dialog :title="form.id?'修改品牌':'添加品牌'" :visible.sync="isShowDialog">
      <el-form :model="form" style="width:80%">
        <el-form-item label="品牌名称" :label-width="'100px'">
          <el-input v-model="form.tmName" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="品牌LOGO" :label-width="'100px'">
          <!-- POST /admin/product/fileUpload -->
          <!--1、上传前对图片限制
              2、上传成功后要赶紧收集返回的图片真实路径 
              3、上传成功后，upload当中img的显式
          -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.logoUrl" :src="form.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowDialog = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTrademark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Trademark",
  data() {
    return {
      page: 1,
      limit: 3,
      // trademarkInfo:{},
      trademarkList: [],
      total: 0,

      isShowDialog: false,

      form: {
        tmName: "",
        logoUrl: "",
      },
    };
  },
  mounted() {
    this.getTrademarkList();
  },
  methods: {
    async getTrademarkList(page = 1) {
      this.page = page;
      const result = await this.$API.trademark.getPageList(
        this.page,
        this.limit
      );
      if (result.code === 200) {
        // this.trademarkInfo = result.data
        this.trademarkList = result.data.records;
        this.total = result.data.total;
      }
    },

    handleSizeChange(size) {
      this.limit = size;
      this.getTrademarkList();
    },

    // 点击添加按钮
    showAddDialog() {
      this.isShowDialog = true;
      //最后添加这个解决添加完成后数据依然存在在form当中的bug
      this.form = {
        tmName: "",
        logoUrl: "",
      };
    },

    // 点击修改按钮
    showUpdateDialog(row) {
      this.isShowDialog = true;

      //row是trademarkList里面的一个对象，用来展示在页面上的
      //我们把row的地址给了form一份   row和form就指向同一个对象，以后修改form就是在修改row,row改了，页面就会改
      // this.form = row //会多一个id

      this.form = { ...row };
    },

    //上传成功的回调函数
    handleAvatarSuccess(res, file) {
      //上传成功后，会返回上传成功的图片的真实的路径
      //我们需要做的很简单就是把这个图片的路径赶紧收集起来
      // console.log(res,file,URL.createObjectURL(file.raw))
      this.form.logoUrl = res.data;
      // this.imageUrl = URL.createObjectURL(file.raw); //拿的是图片的本地路径,假的路径
    },

    //在上传之前可以对上传的文件做限制
    beforeAvatarUpload(file) {
      const typeArr = ["image/jpeg", "image/png"];
      const isJPGOrPNG = typeArr.some((item) => item === file.type);
      const isLt500K = file.size / 1024 < 500;

      if (!isJPGOrPNG) {
        this.$message.error("上传头像图片只能是 JPG或者PNG 格式!");
      }
      if (!isLt500K) {
        this.$message.error("上传头像图片大小不能超过 500K!");
      }
      return isJPGOrPNG && isLt500K;
    },

    //点击确定按钮添加或者修改trademark的请求逻辑
    async addOrUpdateTrademark() {
      //获取参数
      let trademark = this.form;
      //整理参数
      //发请求
      const result = await this.$API.trademark.addOrUpdate(trademark);

      if (result.code === 200) {
        //成功干啥
        //1、提示添加或者修改成功
        this.$message.success(`${trademark.id ? "修改" : "添加"}品牌成功`);
        //2、关闭dialog
        this.isShowDialog = false;
        //3、重新获取列表数据展示
        // 如果是添加我们默认是添加在最后一页，重新获取数据也是默认拿的是第一页
        //但是修改重新获取数据也应该是获取修改的那一页
        this.getTrademarkList(trademark.id ? this.page : 1);
      } else {
        //失败干啥
        //提示添加或者修改失败
        this.$message.error(`${trademark.id ? "修改" : "添加"}品牌失败`);
      }
    },

    //点击删除按钮
    deleteTrademark(row) {
      this.$confirm(`你确定删除${row.tmName}吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const result = await this.$API.trademark.delete(row.id)
          if(result.code === 200){
            //提示
            this.$message.success('删除品牌成功')
            //重新获取列表数据   
            //重新获取数据需要判断当前页数据是不是一个，如果不是那就获取当前页，如果是那就获取前一页
            this.getTrademarkList(this.trademarkList.length > 1? this.page : this.page - 1)
          }else{
            this.$message.success('删除品牌失败')
          }
        })
        .catch(() => {
          this.$message.info('取消删除')
        });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
