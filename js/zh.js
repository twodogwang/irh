Vue.component('du_list_mock', function (resolve, reject) {
  axios.get("template/du_list.html")
  .then(function(res){
    resolve({
      template: res.data,
      props:{
          url: {type: [String], default: ""}
      },
      data:function (){
          return  {
              page : 1,
              list : [],
              end_page: 0
          }
      },
      methods: {
        loadList:function() {
          var _this = this;
          axios.get("https://www.easy-mock.com/mock/5a28a3c2b5c06d61d3371afc/test/" + _this.url + "?page=" + _this.page).then(function (res) {
            console.log(res);
            var num_page = Math.ceil(res.data.total/res.data.pageSize);
            if(_this.page < num_page){
              _this.$refs.end.$emit('ydui.infinitescroll.finishLoad');
              _this.page ++;
            }else{
              _this.$refs.end.$emit('ydui.infinitescroll.loadedDone');
            }
            _this.end_page = num_page;
            _this.list = _this.list.concat(res.data.list);
          });
        }
      },
      mounted: function () {
        this.loadList();
      }
    })
  })
});

Vue.component('zh_poprate', function (resolve, reject) {
  axios.get("template/zh_poprate.html")
  .then(function(res){
    resolve({
      template: res.data,
      props:{
        show: {type: [Object], default: function () {return {show: false}}},
        data: {type: [Object], default: function () {return {}}}
      },
      data:function (){
        return  {
        }
      },
      methods: {
        confirm: function () {
          this.data.rated = true;
          /*console.log(this.show);*/
          this.show.show = false;
        }
      },
      mounted: function () {
        console.log(this.show);
      }
    })
  })
});

Vue.component('zh_popinfo', function (resolve, reject) {
  axios.get("template/zh_popinfo.html")
  .then(function(res){
    resolve({
      template: res.data,
      props:{
        show: {type: [Object], default: function () {return {show: false}}},
        data: {type: [Object], default: function () {return {}}}
      },
      data:function (){
        return  {
        }
      },
      methods: {
        confirm: function () {
          this.data.rated = true;
          /*console.log(this.show);*/
          this.show.show = false;
        }
      },
      mounted: function () {
        console.log(this.show);
      }
    })
  })
});