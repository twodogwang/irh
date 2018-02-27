Vue.component('du_form', function (resolve, reject) {
  axios.get(
      "template/du_form.html"
    )
  .then(
      function(res){
          resolve({
            template: res.data,
            props:{
              url1: {type: [String], default: ""},  //输入
              url2: {type: [String], default: ""}  //输出
            },
            data:function (){
                return  {
                    my:{
                      work_type:"",
                      date1: "",
                      date2: "",
                      time1: "",
                      time2: "",
                      val_disease:[],
                      remark:""
                    },
                    arr_type:[],
                    arr_disease: []
                    
                }
            },
            methods: {
              init:function() {
                console.log(this.$attrs.id,'====初始化!!!');
                this.my.work_type="";
                this.my.val_disease=[];
                this.my.remark="";
                this.my.date1 = moment().add(3, 'days').format("YYYY-MM-DD HH:mm");
                this.my.date2 = moment().format("YYYY-MM-DD HH:mm");
                this.my.time1 = moment().format("YYYY-MM-DD HH:mm");
                this.my.time2 = moment().format("YYYY-MM-DD HH:mm");
              },

              // 远程得到两个select框的备选项
              ajax1:function() {
                get(this.url1)
                .then(
                    function (res) {
                        this.arr_type = res.items;
                    }.bind(this)
                );

                get("/arr_disease")
                .then(
                    function (res) {
                        this.arr_disease = res.items;
                    }.bind(this)
                )
              },

              // 确定
              form_submit:function() {
                var _this = this;
                if(this.my.work_type==""){
                  this.$dialog.toast({
                    mes: "作业项目必须选择",
                    icon: 'error',
                    timeout: 1000
                  });
                  return false;
                };

                post(this.url2,{})
                .then(
                    function (res) {
                      if(res.flag){
                        this.$dialog.toast({
                          mes: "提交成功!",
                          icon: 'success',
                          timeout: 1000,
                          callback: function () {
                            _this.$emit('success');
                          }
                        });
                        
                      }else{
                        this.$dialog.toast({
                          mes: "提交失败",
                          icon: 'error',
                          timeout: 1000
                        });
                        // this.$emit('fail');
                      }
                    }.bind(this)
                );
              }
            },
            mounted: function() {
              this.init();
              this.ajax1();
            }
          })
    })
});
