<template>
    <div class="receive-payment">
        <div class="top">
            <div class="title">
                Hệ thống tài khoản
                <div class="back">
                    <div class="icon icon-back"></div>
                    Tất cả danh mục
                </div>
            </div>
            <div class="top-btn">
                 <div class="button-add">
                    <button class="change-acc">Chuyển tài khoản hạch toán</button>
                </div>
                <div class="button-add" @click="btnAddAccountOnClick()">
                    <button>Thêm</button>
                </div> 
            </div>
        </div>
        <div class="body">
            <div class="grid-Supp">
                <div class="grid-filter">
                    <div class="grid-filter-left">
                        <div class="header-search">
                            <input type="text" v-model="txtSearch" class="txt-search" placeholder="Tìm theo số, tên tài khoản">
                            <div class="icon icon-search"></div>
                        </div>
                    </div>
                    <div class="grid-filter-right">
                        <div class="collap" @click="collapseAll()">Thu gọn</div>
                        <div class="icon icon-excel"></div>
                        
                    </div>
                </div>

                <div class="grid-content">
                <el-table
                        ref="multipleTable"
                        :data="dataSearch"
                        style="width: 100%"
                        height="100%"
                        row-key="AccountId"
                        :default-expand-all="collapse"
                        @cell-dblclick="dbClickForEdit"
                    >

                        <el-table-column
                            prop="AccountCode"
                            label="SỐ TÀI KHOẢN"
                            width="150"
                            ref="test"
                            >
                        </el-table-column>

                        <el-table-column
                            prop="AccountName"
                            label="TÊN TÀI KHOẢN"
                            width="350">
                        </el-table-column>

                        <el-table-column
                            prop="PropertieName"
                            label="TÍNH CHẤT"
                            width="150">
                        </el-table-column>

                        <el-table-column
                            prop="AccountNameEnglish"
                            label="TÊN TIẾNG ANH"
                            width="345">
                        </el-table-column>

                        <el-table-column
                            prop="Explain"
                            label="DIỄN GIẢI"
                            width="300">
                        </el-table-column>

                        <el-table-column
                            prop="Status"
                            label="TRẠNG THÁI"
                            width="200">
                        </el-table-column>


                        <el-table-column
                            fixed="right"
                            label="Chức năng"
                            width="210">
                            <template slot-scope="control">
                                <div style="display:flex;align-items: center;justify-content: center;">
                                    <button class="btn-edit" @click="btnEditOnClick(control.row.AccountId)">Sửa</button>
                                    <el-dropdown trigger="click">
                                        <span class="el-dropdown-link">
                                            <i class="el-icon-caret-bottom"></i>
                                        </span>

                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item @click.native.prevent="duplicateAccount(control.row.AccountId)" >Nhân bản</el-dropdown-item>
                                            <el-dropdown-item @click.native.prevent="confirmDelete(control.row)" >Xóa</el-dropdown-item>
                                            <el-dropdown-item @click.native.prevent="stopUse(control.row.AccountId)" >Ngưng sử dụng</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </div>
                            </template>
                        </el-table-column>

                    </el-table>
                    <div class="footer-fixed">
                        <div class="grid-footer">
                            <div class="footer-left">Tổng số: <span style="font-weight:700">{{totalRecord}}</span> bản ghi</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <AddAccount @reloadDataAccount="reloadData()"/>
    </div>
</template>

<script>
import {busData} from '@/main.js'
import AddAccount from './AddAccount'
import BaseAPI from '@/BaseAPI.js'

    export default {
        components:{
            AddAccount
        },
        data(){
            return{
                thisPage:'ReceivePayment',
                collapse:true,
                data:[],
                multipleSelection: [],
                reload:false,
                totalRecord:0,
                refresh:true,
                txtSearch:'',

                AccountIdDelete:'' // ID đối tượng chuẩn bị xóa
            }
        },
        created(){

            /**
             * Khi người dùng xác nhận xóa
             * Author: BTTu (25/11/2020)
             */
            busData.$on('acceptConfirm',()=>{
                if(this.AccountIdDelete){
                    this.deleteAccount(this.AccountIdDelete);
                    this.AccountIdDelete = '';
                }
            }),

            /**
             * Khi người dùng hủy xóa
             * Author: BTTu (25/11/2020)
             */
            busData.$on('cancelConfirm',()=>{
                this.AccountIdDelete = '';
            })
        },
        mounted(){
            this.getAccounts();
        },
        methods:{
           
            /**
             * Lấy danh sách tài khoản (Tạo thành dạng cây)
             * Author: BTTu (25/11/2020)
             */
            async getAccounts(){
                let tempdata = [];
                let res = await BaseAPI.Get('https://localhost:44363/api/accounts'); 
                if(res && res.data){
                    //Sắp xếp theo AccountCode
                    tempdata = res.data.sort((a,b)=>{
                        if(a.AccountCode > b.AccountCode)   return 1;
                        else if(a.AccountCode < b.AccountCode)  return -1;
                        return 0
                    });
                    this.totalRecord = res.data.length; // tổng số bản ghi
                    //Phân cấp cha con
                    for(let i =0 ;i<tempdata.length;i++){
                        tempdata[i].children = [];

                        if(tempdata[i].Status == true)
                            tempdata[i].Status = 'Đang sử dụng';
                        else    tempdata[i].Status = 'Ngưng sử dụng';

                        if(!tempdata[i].parent){
                            tempdata[i].parent = 0;
                        }
                        let sureNot = false;
                        for(let j=i+1;j<tempdata.length;j++){
                            if(tempdata[i].AccountCode == tempdata[j].AccountCodeRoot){
                                tempdata[i].children.push(tempdata[j]);
                                tempdata[j].parent = 1;
                            }else{
                                sureNot == true;
                            }
                        }
                        if(sureNot == true) continue;
                    }
                    
                    let result =  tempdata.filter(function(item){
                        return item.children.length >= 0 && item.parent == 0;
                    })
                    this.data = result;
                }
            },
            
            /**
             * Sửa thông tin tài khoản
             * Author: BTTu (25/11/2020)
             * @param {String} id
             */
            async btnEditOnClick(id){
                let res = await BaseAPI.GetObj('https://localhost:44363/api/accounts',id); 
                if(res && res.data){
                    //gửi thông tin tài khoản lấy được cho AddAccount show lên
                    busData.$emit('editAccount',res.data);
                }
            },

            /**
             * Nhân bản tài khoản
             * Author: BTTu (25/11/2020)
             * @param {String} id
             */
            async duplicateAccount(id){
                let res = await BaseAPI.GetObj('https://localhost:44363/api/accounts',id); 
                if(res && res.data){
                    //gửi thông tin tài khoản lấy được cho AddAccount show lên
                    busData.$emit('duplicateAccount',res.data);
                }
            },

            /**
             * Trước khi xóa, yêu cầu xác nhận lần 2 để xóa
             * Author: BTTu (25/11/2020)
             * @param {Object} row
             */
            confirmDelete(row){
                let mes = 'Bạn có thực sự muốn xóa tài khoản < '+ row.AccountCode +' > không?';
                this.AccountIdDelete = row.AccountId;
                busData.$emit('showDialogConfirm',mes);
            },

            /**
             * Xóa tài khoản
             * Author: BTTu (25/11/2020)
             * @param {String} id
             */
            async deleteAccount(id){
                let res = await BaseAPI.Delete('https://localhost:44363/api/accounts',id); 
                if(res && res.data){
                    this.reloadData();
                }
            },

            /**
             * Ngưng sử dụng
             * Author: BTTu (25/11/2020)
             * @param {String} id
             */
            async stopUse(id){
                let res = await BaseAPI.GetObj('https://localhost:44363/api/accounts',id); 
                if(res && res.data){
                    let currenAcc = res.data;
                    console.log(currenAcc);
                    currenAcc.Status = false;
                    let res2 = await BaseAPI.Put('https://localhost:44363/api/accounts',currenAcc.AccountId,currenAcc);
                    if(res2){
                        this.reloadData();
                    }
                } 
            },

            /**
             * Sự kiện thêm tài khoản
             * Author: BTTu (25/11/2020)
             */
            btnAddAccountOnClick(){
                //gửi yêu cầu show form cho AddAccount
                busData.$emit('showDialogAddAccount');
            },

            /**
             * Sự kiện double click vào 1 bản ghi
             * Author: BTTu (25/11/2020)
             */
            dbClickForEdit(row){
                this.btnEditOnClick(row.AccountId);
            },

            /**
             * Load lại dữ liệu
             */
            reloadData(){
                this.getAccounts();
            },

            collapseAll(){
                this.collapse = !this.collapse;
            },

            /**
             * Hàm bổ trợ cho chức năng tìm kiếm
             * @param {Object} item
             * @param {String} search
             */
            supportSearch(item,search){
                let aimsSearch = ['AccountCode','AccountName'];
                for(let i=0;i<aimsSearch.length;i++){
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
                    x => !this.txtSearch || this.supportSearch(x,this.txtSearch)
                )
            }
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
    border-radius: 30px;
    padding: 8px 22px;
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
.button-add button.change-acc{
    background: transparent;
    border-color: #8d9096;
    color:  #212121;
    margin-right: 10px;
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
    height: 67px;
    color: #fff;
}
.view-item{
    width: 33%!important;
}

.view-item.revenue{
    background: #ff7f2c;
    padding: 6px 10px;
    overflow: hidden;
}
.view-item.deposit{
    background: rgb(184, 188, 195);
    margin-left: 0.5%;
    margin-right: 0.5%;
    padding: 6px 10px;
    overflow: hidden;
}
.view-item.remain{
    background: #74cb2f;
    padding: 6px 10px;
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
.collap{
    font-size: 13px;
    color: #0075c0;
    margin-top: 3px;
    margin-right: 12px;
    cursor: pointer;
}
.grid-Supp{
    height:calc(100% - 131px);
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
.grid-filter-left .header-search{
    width: 300px;
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
.grid-content{
    background: #fff;
    width: 100%;
    height:100%;
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
    position: fixed;
    bottom: 5px;
    left: 185px;
    width: calc(100% - 215px);
    z-index: 3;
}
.grid-footer{
    width: 100%;
    height: 40px;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
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
    margin: 0px 20px;
}
.disable{
    cursor: default!important;
    color: #9e9e9e;
}
.btn-edit{
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