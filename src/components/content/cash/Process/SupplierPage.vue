<template>
    <div class="receive-payment">
        <div class="top">
            <div class="title">
                Danh sách nhà cung cấp
                <div class="back">
                    <div class="icon icon-back"></div>
                    Tất cả danh mục
                </div>
            </div>
            <div class="top-btn">
                <div class="nav-tab-right">
                    <div class="icon icon-tour"></div>
                    <div class="tour-label">Hướng dẫn</div>
                </div>
                <div class="btn-filter">
                    <button>Tiện ích <div class="icon icon-filtdown"></div> </button>
                </div>
                <div class="button-add">
                    <button @click="btnAddSupplierOnClick()">Thêm</button>
                    <button class="down-list">
                        <div class="split"></div>
                        <div class="icon icon-downlist"></div>
                    </button>
                </div> 
            </div>
        </div>
        <div class="body">
           <div class="overview">
                <div class="view-item revenue">
                    <div class="dummy-view"  style="padding: 0px 10px 3px 10px;">
                        <div class="toltal-money">
                            31.053.767.635,00
                        </div>
                        <div class="title-money">Nợ quá hạn</div>
                    </div>
                    <div class="over-line"></div>
                </div>
                <div class="view-item deposit">
                     <div class="dummy-view"  style="padding: 0px 10px 3px 10px;">
                          <div class="toltal-money">
                            10.925.312.281,00
                        </div>
                        <div class="title-money">Tổng nợ phải trả</div>
                     </div>
                     <div class="over-line"></div>
                </div>
                <div class="view-item remain" style="padding: 0px 10px 8px 10px;">
                    <div class="toltal-money">
                        26.760.000,00
                    </div>
                    <div class="title-money">Đã thanh toán (30 ngày gần đây)</div>
                </div>
            </div>
        <div class="grid-Supp">
            <div class="grid-filter">
                <div class="grid-filter-left">
                    <div class="icon icon-checkall"></div>
                    <div class="btn-filter action-all">
                        <button>Thực hiện hàng loạt <div class="icon icon-filtdown"></div> </button>
                    </div>
                    <div class="btn-filter">
                        <button>Lọc <div class="icon icon-filtdown"></div> </button>
                    </div>
                </div>
                <div class="grid-filter-right">
                    <div class="header-search">
                        <input type="text" v-model="txtSearch" class="txt-search" placeholder="Nhập từ khóa tìm kiếm">
                        <div class="icon icon-search"></div>
                    </div>
                    <div class="icon icon-excel"></div>
                    <div class="icon icon-settinglist"></div>
                    <div class="collap-over">
                        <div class="icon icon-collap"></div>
                    </div>
                </div>
            </div>

            <div class="grid-content">
            <el-table
                    ref="multipleTable"
                    :data="dataSearch"
                    style="width: 100%"
                    height="100%"
                    @cell-dblclick="dbClickForReview"	
                >

                    <el-table-column
                    type="selection"
                    fixed="left"
                    width="50">
                    </el-table-column>

                    <el-table-column
                    property="SupplierCode"
                    label="MÃ NHÀ CUNG CẤP"
                    width="220">
                    </el-table-column>

                    <el-table-column
                    property="SupplierName"
                    label="TÊN NHÀ CUNG CẤP"
                    width="400">
                    </el-table-column>

                    <el-table-column
                    property="Address"
                    label="ĐỊA CHỈ"
                    width="300">
                    </el-table-column>

                    <el-table-column
                    property="Debt"
                    label="CÔNG NỢ"
                    width="175">
                    </el-table-column>

                    <el-table-column
                    property="TaxCode"
                    label="MÃ SỐ THUẾ"
                    width="170">
                    </el-table-column>

                    <el-table-column
                    property="Mobile"
                    label="ĐIỆN THOẠI"
                    width="175">
                    </el-table-column>

                    <el-table-column
                        fixed="right"
                        label="CHỨC NĂNG"
                        width="185">
                        <template slot-scope="control">
                                <div style="display:flex;align-items: center;justify-content: center;">
                                    <button class="btn-pay">Trả tiền</button>
                                    <el-dropdown trigger="click">
                                        <span class="el-dropdown-link">
                                            <i class="el-icon-caret-bottom"></i>
                                        </span>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item @click.native.prevent="editRow(control.row.SupplierId)" >Sửa</el-dropdown-item>
                                            <el-dropdown-item @click.native.prevent="deleteRow(control.row)" >Xóa</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </div>
                            </template>
                    </el-table-column>
                </el-table>
                <div class="footer-fixed">
                    <div class="grid-footer">
                    <div class="footer-left">Tổng số: <span style="font-weight:700">{{totalRecord}}</span> bản ghi</div>
                        <div class="footer-right">
                            <div class="recordOnPage"><MSSelect v-model="recordOnPage" :data="recordPages"/></div>
                            <div class="totalPage">
                                <div class="pre" :class="{disable:pageNow == 1}" @click="prePage()">Trước</div>
                                <div class="page-list">
                                    <div class="page" v-for="index in totalPage" :key="index" :class="{active: pageNow == index}" @click="gotoPage(index)">
                                        {{index}}
                                    </div>
                                </div>
                                <div class="next" :class="{disable:pageNow == totalPage}" @click="nextPage()">Sau</div>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    </div> 
        </div>
        <AddSupplier />
        <DialogNotification />
    </div>
</template>

<script>
import {busData} from '@/main.js'
import AddSupplier from '../AddSupplier'
import BaseAPI from '@/BaseAPI.js'
import MSSelect from '@/components/common/MSSelect'
    export default {
        components:{
            AddSupplier,
            MSSelect
        },
        data(){
            return{
                data: [
                    //Danh sách nhà cung cấp
                ],
                
                //Paging
                recordPages:[{value:'10',label:'10 bản ghi trên 1 trang'},
                    {value:'20',label:'20 bản ghi trên 1 trang'},
                    {value:'30',label:'50 bản ghi trên 1 trang'},
                    {value:'40',label:'100 bản ghi trên 1 trang'},
                ],
                totalRecord:0,
                totalPage:0,
                pageNow:1,
                recordOnPage:'20',
                txtSearch:'',

                SupplierIdDelete:'' // ID đối tượng chuẩn bị xóa
            }
        },
        created(){

            //Lắng nghe sự kiện load lại data từ AddSupplier
            busData.$on('reloadData',()=>{
                this.GetDataSuplier(this.pageNow,this.recordOnPage);
            }),

             //Khi người dùng xác nhận xóa
            busData.$on('acceptConfirm',()=>{
                if(this.SupplierIdDelete){
                    this.DeleteSuplier(this.SupplierIdDelete);
                    this.SupplierIdDelete = '';
                }
            }),
            //Khi người dùng hủy xóa
            busData.$on('cancelConfirm',()=>{
                this.SupplierIdDelete = '';
            })
        },
        mounted(){
            this.GetDataSuplier(this.pageNow,this.recordOnPage);
            document.addEventListener('keyup', this.keyupHandler)
        },
        methods:{
            
            /**
                * Lấy danh sách nhà cung cấp từ service
                * Author:BTTu (25/11/2020)
                * @param {number,String} page
                * @param {number,String} record
             */
            async GetDataSuplier(page,record){
                let res = await BaseAPI.GetByPaging('https://localhost:44363/api/suppliers',page,record); 
                if(res){
                    this.data = res.data.Data;
                    this.totalRecord = res.data.TotalRecord;
                    this.totalPage = res.data.TotalPage;
                    this.pageNow = page
                }
            },
             /**
                * Xóa nhà cung cấp
                * Author: BTTu (25/11/2020)
                * @param {String} id
             */
            async DeleteSuplier(id){
                let res = await BaseAPI.Delete('https://localhost:44363/api/suppliers',id); 
                if(res && res.status){
                    this.GetDataSuplier(this.pageNow,this.recordOnPage);
                }
            },

            /**
             * Sự kiện xóa 1 bản ghi
             * Author: BTTu (25/11/2020)
             */
            deleteRow(row){
                let mes = 'Bạn có thực sự muốn xóa nhà cung cấp < '+ row.SupplierCode +' > không?';
                this.SupplierIdDelete = row.SupplierId;
                busData.$emit('showDialogConfirm',mes);
            },

            /**
             * Sự kiện thêm supplier
             * Author: BTTu (25/11/2020)
             */
            btnAddSupplierOnClick(){
                busData.$emit('showFormAddSupplier');
            },

            /**
             * Sửa thông tin nhân viên
             * Author: BTTu (25/11/2020)
             * @param {String} SuppID
             */
            async editRow(SuppID){
                //Lấy thông tin nhân viên đó rồi gửi sang form addSupplier để sửa
                let res = await BaseAPI.GetObj('https://localhost:44363/api/suppliers',SuppID); 
                if(res && res.data){
                    busData.$emit('editSupplier',res.data);
                }
            },
            /**
             * Sự kiện double click vào 1 trường
             * Author: BTTu (25/11/2020)
             * @param {Object} row
             */
            async dbClickForReview(row){
                //Lấy thông tin nhân viên đó rồi gửi sang form addSupplier để sửa
                let res = await BaseAPI.GetObj('https://localhost:44363/api/suppliers',row.SupplierId); 
                if(res && res.data){
                    busData.$emit('editSupplier',res.data);
                }
            },
            /**
             * Xử lý phím tắt 
             * Author: BTTu (25/11/2020)
             */
            keyupHandler(event){
                //Show form thêm nhà cung cấp
                if (event.ctrlKey && event.code  === 'F9') {
                    busData.$emit('showFormAddSupplier');
                }
            },

            /**
             * Xử lý phân trang
             * Author: BTTu (25/11/2020)
             */
            gotoPage(page){ // tới thẳng 1 trang bất kỳ
                this.GetDataSuplier(page,this.recordOnPage);
            },
            prePage(){ // Lùi lại 1 trang
                if(this.pageNow > 1){
                    this.GetDataSuplier(this.pageNow-1,this.recordOnPage);
                }
            },
            nextPage(){ // Tiến lên 1 trang
                if(this.pageNow < this.totalPage){
                    this.GetDataSuplier(this.pageNow+1,this.recordOnPage);
                }
            },
            //---------------------------------------------------------------------------

            /**
             * Hàm bổ trợ cho chức năng tìm kiếm
             * @param {Object} item
             * @param {String} search
             */
            supportSearch(item,search){
                let aimsSearch = ['SupplierCode','SupplierName','Address','TaxCode','Mobile'];
                for(let i=0;i < aimsSearch.length;i++){
                    if(item[aimsSearch[i]] && item[aimsSearch[i]].toLowerCase().includes(search.toLowerCase())){
                        return true;
                    }
                }
                return false;
            },
            
        },
        computed:{
            /**
             * Tìm kiếm all column
             * Author: BTTu (25/11/2020)
             */
            dataSearch(){
                return this.data.filter(
                    item => !this.txtSearch || this.supportSearch(item,this.txtSearch)
                )
            }
        },
        watch:{
            //Cập nhật lại danh sách dữ liệu, khi người dùng thay đổi số trang trên 1 page
            recordOnPage:function(){
                this.GetDataSuplier(this.pageNow,this.recordOnPage);
            },
        }
     
    }
</script>

<style scoped>
.receive-payment{
    height: calc(100vh - 114px);
}
.top{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    padding-top: 10px;
    margin-bottom: 16px;
}
.top .title{
    padding-top: 22px;
    font-size: 24px;
    font-weight: 700;
    color: #212121;
    flex: 1;
}
.back{
    display: flex;
    align-items: center;
    color: #0075c0;
    cursor: pointer;
    font-weight: 400;
    font-size: 13px;
}
.icon.icon-back{
    background-position: -224px -356px;
}
.top-btn{
    display: flex;
    margin-right: 30px;
}
.button-add{
    display: flex;
    align-items: center;
}
.button-add button{
    border-radius: 30px 0 0 30px;
    padding: 8px 14px 8px 20px;
    height: 36px;
    background: #2ca01c;
    border: 1px solid transparent;
    color: #fff;
    cursor: pointer;
    box-sizing: border-box;
    outline: none;
    position: relative;
}
.button-add button:hover{
    background: #35bf22;
}
.button-add .split{
    left: 0px;
    height: 20px;
    top: 8px;
    position: absolute;
    border-left: 1px solid #fff;
    width: 5px;
}
.button-add button.down-list{
    width: 46px;
    border-radius: 0 30px 30px 0;
    height: 36px;
    padding: 8px 10px 8px 10px;
    border: 1px solid transparent;
    color: #fff;
    transition: all .2s ease;
    cursor: pointer;
    box-sizing: border-box;
}
.icon.icon-downlist{
    background-position: -845px -358px;
}
.receive-payment .body{
    padding: 0 30px 0 0;
    overflow: auto;
    height: calc(100vh - 138px);
}
.overview{
    display: flex;
    margin-bottom: 24px;
    height: 71px;
    color: #fff;
}
.view-item{
    width: 33%!important;
}
.revenue{
    background: #ff7f2c;
    overflow: hidden;
    margin-top: 6px;
}
.deposit{
    background: rgb(184, 188, 195);
    margin-left: 0.5%;
    margin-right: 0.5%;
    margin-top: 6px;
    overflow: hidden;
}
.view-item.revenue:hover,.view-item.deposit:hover{
    margin-top: 0px;
}
.view-item.remain{
    background: #74cb2f;
    margin-top: 6px;
    overflow: hidden;
}
.toltal-money{
    font-size: 25px;
    margin-bottom: 4px;
}
.title-money{
    font-size: 14px;
}
.nav-tab-right{
    display: flex;
    align-items: center;
    margin-right: 8px;
}
.black-model{
   position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.4;
    background-color: #000;
    z-index: 4;
}
.grid-Supp{
    height:calc(100% - 140px);
}
.grid-filter{
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    padding: 16px 16px 20px 16px;
}
.grid-filter-left{
    display: flex;
}
.icon.icon-checkall{
    cursor: pointer;
    display: inline-block;
    padding: 13px 12px 0 12px;
    background-position: -243px -130px;
}
.grid-filter-right{
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}
.icon.icon-excel{
    background-position: -704px -200px;
    margin-right:6px;
}
.icon.icon-settinglist{
    background-position: -88px -200px;
     margin: 0px 6px;
}
.collap-over{
    border: 2px solid #e2e9f2;
    background: #f2f5f8;
    position: absolute;
    width: 30px;
    height: 28px;
    top: -35px;
    right: -26px;
    cursor: pointer;
    z-index: 2;
}
.collap-over .icon.icon-collap{
    background-position: -120px -353px;
}
.over-line{
    padding-top: 6px;
    background: #707070;
    opacity: .5;
}
.grid-content{
    background: #fff;
    width: calc(100% - 30px);
    height:calc(100% - 70px);
    padding:0px 15px;
}
.table-scroll{
    overflow-y: auto;
    max-height: none;
    min-width: calc(100% + 30px);
}
.table-scroll table{
    border-spacing: 0;
    min-width: 100%;
}
.out-right-gray{
    min-width: 30px;
    position: sticky;
    border: none;
    width: 30px;
    max-width: 30px;
    z-index: 3;
    padding: 0;
    background: #f4f5f6;
    right: 0;
    z-index: 99;
}
.tbody-viewer{
    background-color: #fff;
    display: contents;
}
.show-detail{
    color: #0075c0;
    width: 100%;
    height: 100%;
    line-height: 13px;
    vertical-align: middle;
    display: flex;
    align-items: center;
}
.show-detail:hover{
    cursor: pointer;
    text-decoration: underline;
}
.btn-show{
    display: flex;
    justify-content: center;
    align-items: center;
}
.btn-text{
    padding: 6px 0 6px 16px!important;
    color: #0075c0;
    border-radius: 3px 0 0 3px;
    height: 36px;
    transition: all .2s ease;
    border: 0;
    cursor: pointer;
    position: relative;
    box-sizing: border-box;
    background: transparent;
    overflow: visible;
}
.icon.btn-icon-show{
    width: 46px;
    color: #0075c0;
    border-radius: 0 3px 3px 0;
    height: 36px;
    padding: 8px 10px 8px 10px;
    position: relative;
    background-position: -883px -350px;
    border: none;
}
tfoot{
    background-color: #f8f9fe !important;
}
.footer-fixed{
    bottom: 5px;
    left: 185px;
    width: 100%;
    z-index: 2;
}
.grid-footer{
    width: calc(100% - 225px);
    height: 38px;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    bottom: 11px; 
    right: 32px;
}
.footer-left{
    margin-left: 30px;
}
.footer-right{
    display: flex;
    align-items: center;
    margin-right: 25px;
}
.recordOnPage{
    width: 200px;
}
.totalPage{
    display: flex;
    margin-left: 10px;
}
.page-list{
    display: flex;
    justify-content: center;
    align-items: center;
}
.page{
    padding:0px .5rem!important;
    cursor: pointer;
}
.page.active{
    border: 1px solid #e0e0e0;
    font-weight: 700;
    text-align: center;
}
.pre,.next{
    cursor: pointer;
    margin: 0px 20px;
}
.disable{
    cursor: default!important;
    color: #9e9e9e;
}
.btn-pay{
    padding: 6px 0 6px 16px!important;
    color: #0075c0;
    transition: all .2s ease;
    border: 0;
    cursor: pointer;
    position: relative;
    box-sizing: border-box;
    background: transparent;
    overflow: visible;
    margin-right: 10px;
    font-weight: 600;
    font-size: 13px;
    line-height: 13px;
}
</style>