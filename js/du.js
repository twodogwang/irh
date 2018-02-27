var mixin_test = {
  props: ["test"],
  methods: {
    init_test: function () {
      this.list = this.test;
      this.$root.loading(false);
      return false;
    }
  }
};

Vue.component('du_list_post', function (resolve, reject) {
  axios.get(
    "template/du_list.html"
  )
    .then(
    function (res) {
      resolve({
        mixins: [mixin_test],
        template: res.data,
        props: ["url", "api_para"],
        data: function () {
          return {
            page: 0,
            para: {},
            list: []
          }
        },
        methods: {
          init: function () {

            var _this = this;
            this.para = this.api_para ? this.api_para : {};

            this.page = 0;
            this.list = [];
            this.$refs.end.$emit('ydui.infinitescroll.reInit');
            this.loadList();
          },
          loadList: function () {
            var _this = this;
            this.page++
            this.para["page"] = this.page;
            post(this.url, this.para)
              .then(
              function (res) {
                if (res.total) {
                  console.log(_this.$attrs.name, '--此列表分页');
                  var num_page = Math.ceil(res.total / res.pageSize);
                  if (_this.page < num_page) {
                    _this.$refs.end.$emit('ydui.infinitescroll.finishLoad');
                  } else {
                    _this.$refs.end.$emit('ydui.infinitescroll.loadedDone');
                  }
                } else {
                  console.log(_this.$attrs.name, '--此列表不分页');
                  _this.$refs.end.$emit('ydui.infinitescroll.loadedDone');
                }

                _this.$root.loading(false);
                _this.list = _this.list.concat(res.items);

              }
              ).catch(
              function (err) {
                _this.$dialog.toast({ mes: err, icon: 'error', timeout: 2000 });
              }
              )

          }
        },
        mounted: function () {
          if (this.test) {
            this.init_test();
          } else {
            this.init();
          }
        }
      })
    })
});

Vue.component('du_list', function (resolve, reject) {
  axios.get(
    "template/du_list.html"
  )
    .then(
    function (res) {
      resolve({
        mixins: [mixin_test],
        template: res.data,
        props: ["url", "api_para"],
        data: function () {
          return {
            page: 0,
            para: {},
            list: []
          }
        },
        methods: {
          init: function () {
            var _this = this;
            this.para = this.api_para ? this.api_para : {};

            this.page = 0;
            this.list = [];
            this.$refs.end.$emit('ydui.infinitescroll.reInit');
            this.loadList();
          },
          loadList: function () {
            var _this = this;
            this.page++
            this.para["page"] = this.page;
            get(this.url, this.para)
              .then(
              function (res) {
                if (res.pageSize) {
                  console.log(_this.$attrs.name, '--此列表分页');
                  var num_page = Math.ceil(res.total / res.pageSize);
                  if (_this.page < num_page) {
                    _this.$refs.end.$emit('ydui.infinitescroll.finishLoad');
                  } else {
                    _this.$refs.end.$emit('ydui.infinitescroll.loadedDone');
                  }
                } else {
                  console.log(_this.$attrs.name, '--此列表不分页');
                  _this.$refs.end.$emit('ydui.infinitescroll.loadedDone');
                }

                _this.$root.loading(false);
                _this.list = _this.list.concat(res.items);
              }
              ).catch(
              function (err) {
                _this.$dialog.toast({ mes: err, icon: 'error', timeout: 2000 });
              }
              )

          }
        },
        mounted: function () {
          if (this.test) {
            this.init_test();
          } else {
            this.init();
          }
        }
      })
    })
});



//做业项目选择框
Vue.component('du_project_id', function (resolve, reject) {
  axios.get("template/du_project_id.html")
    .then(
    function (res) {
      resolve({
        template: res.data,
        props: ["pid"],
        methods: {
          changeH: function (n) {
            this.$emit('update:change', n);
          },
        },
        data: function () {
          return {
            projectId: this.pid,
            ProjectId_option: []
          }
        },
        mounted: function () {
          api_server.get("MyHomeWork/GetHomeWorkProjectList")
            .then(function (res) {
              this.ProjectId_option = res.items;
            }.bind(this))
        }
      })
    })
});

//关联病种-多选框
Vue.component('du_demand_names', function (resolve, reject) {
  axios.get("template/du_demand_names.html")
    .then(
    function (res) {
      resolve({
        template: res.data,

        // 此入入值是一个字符型，注意要转成数组型后，再传给el-select控件
        props: ["str_vals"],
        methods: {
          changeH: function (n) {
            this.$emit('update:str_vals', arr2str(this.arr_vals));
          },
        },
        data: function () {
          return {
            arr_vals: [],
            DemandName_option: []
          }
        },
        mounted: function () {

          var _this = this;
          api_server.get("/DataInput/GetDiseaseInfo")
            .then(function (res) {
              this.DemandName_option = res.items;
              this.arr_vals = str2arr(this.str_vals);
            }.bind(this))
        }
      })
    })
});

// a链接加强版，可通过地址传参方式，发送对象型数据，以及传送当前url
Vue.component('aa', {
  props: ["href", "obj", "store"],
  data: function () {
    return { link: "" }
  },
  template: "<a :href='link'><slot></slot></a>",
  mounted: function () {
    var str = "";
    if (this.obj) {
      var _obj = this.obj;
      for (var ii in _obj) {
        str = str + ii + "=" + _obj[ii] + "&"
      }
    }

    //再加上当前地址，备用
    var base = window.location.pathname;
    var self_name = base.split("/").pop();
    this.link = this.href + "?" + str + "from=" + self_name;
  }
});

// 底部四联导航
Vue.component('nav2', {
  props: ["current"],
  data: function () {
    return {
      arr: [
        { url: "main.html", tit: "我的作业", ico: "icon-label_wodezuoye" },
        { url: "my.html", tit: "保健组", ico: "icon-label_baojianzu" },
        { url: "know.html", tit: "知识库", ico: "icon-label_zhishiku" },
        { url: "my.html", tit: "我", ico: "icon-label_wo" }
      ]
    }
  },
  template: "<div class='layout_foot'><nav class='nav2'>\
                <a v-for='(item,index) in arr' :href='item.url' :class=\"{'active':current==index}\"><i class='iconfont' :class='item.ico'></i>{{item.tit}}</a></nav></div>",
  mounted: function () { }
});


// select 暂未使用
Vue.component('du_select', {
  props: {
    default: { type: [String], default: "请选择" }
  },
  mounted: function () {
    this.val = this.default;
  },
  data: function () {
    return {
      val: ""
    }
  },
  template: "<div class='du_select'>{{val}} <i class='iconfont icon-enter'></i></div>"
});

// select暂未使用
Vue.component('du_option', {
  props: ["arr", "show"],
  data: function () { return {} },
  methods: {
    clickH: function (n) {
      this.$emit('change', n);
    }
  },
  template: "<transition name='t2'><ul class='du_option' v-if='show'> <li v-for='item in arr' @click='clickH(item)'>{{item}}</li> </ul></transition>"
});

// 时间选择器
Vue.component('du_date_filter', {
  props: [],
  data: function () {
    return {
      time1: MMD,
      time2: MMD
    }
  },
  methods: {
    clickH: function () {
      this.$emit('change', { time1: this.time1, time2: this.time2 });
    }
  },
  template: "<div class='date_filter'>\
                    <div class='ico'><svg class='icon' aria-hidden='true'>\
                    <use xlink:href='#icon-riqixuanze'></use>\
                    </svg>\
                  </div>\
                    <yd-datetime class='date1' type='date' v-model='time1'></yd-datetime> - \
                    <yd-datetime class='date2' type='date' v-model='time2'></yd-datetime>\
                    <div class='btn' @click='clickH'>确定</div>\
                  </div>"
});

Vue.component('du_date_onefilter', {
  props: [],
  data: function () {
    return {
      time1: MMD
    }
  },
  methods: {
    clickH: function () {
      this.$emit('change', { time1: this.time1 });
    }
  },
  template: "<div class='date_filter'>\
                    <div class='ico'><svg class='icon' aria-hidden='true'>\
                    <use xlink:href='#icon-riqixuanze'></use>\
                    </svg>\
                  </div>\
                    <yd-datetime class='date1' type='date' v-model='time1'></yd-datetime>\
                    <div class='btn' @click='clickH'>确定</div>\
                  </div>"
});

// 居中的下拉选择器
Vue.component('du_dropdown', {
  props: ["arr"],
  methods: {
    commandH: function (n) {
      this.$emit('change', n);
    }
  },
  template: "<div class='layout_select'>\
                <el-dropdown trigger='click' @command='commandH'>\
                  <span class='el-dropdown-link'>\
                    <slot></slot>\
                    <i class='iconfont icon-nav_xinzeng'></i>\
                  </span>\
                  <el-dropdown-menu slot='dropdown'>\
                    <el-dropdown-item :command='item.val' v-for='item in arr' :key='item.val'>{{item.label}}</el-dropdown-item>\
                  </el-dropdown-menu>\
                </el-dropdown>\
              </div>"
});

// 上传组件
Vue.component('du_upload', {
  props: [],
  mounted: function () {
    // console.log("---",ROOT2);
  },
  computed: {
    header_token: function () {
      return { token: "M3Bu8CXsuQhCvBH8JTkkjpCc81qUz4DK44bL3vhDsCungmuLrHseo2SNeDVNFBJzBq/1SbeEU0VVrq/CPVurCyMt5+YlQ735w/W/auBpyQSE9kkn24eySK7T2ZdoYZgX6PXALReS5l51QwzVf0eQnYvDJJBKxG91Wpz9cvbg3Rw=" }
    },
    action_url: function () {
      return ROOT2 + '/OE/UploadFile/AttachUpload'
    }
  },
  data: function () {
    return {
      arrRes: []
    }
  },
  methods: {
    sucH: function (res, b, c) {
      console.log("------", res);
      console.log("---b---", b);
      console.log("--c----", c);
      /*str.split("/").pop().split(".")[0];
      this.arrRes.push(ROOT2+res.data[0]);
      this.$emit('change', this.arrRes);*/
    }
  },
  template: "<el-upload\
                :action= 'action_url'\
                multiple\
                :limit='10'\
                :headers='header_token'\
                :show-file-list='false'\
                :on-success='sucH'>\
                <slot></slot>\
              </el-upload>"
});


// 接收传参地址的返回链接
Vue.component('bb', {
  props: {
    // 在上一页地址为空时，链接到href
    href: { type: [String], default: "" }
  },
  data: function () {
    return {
      link: getQS("from")
    }
  },
  template: "<a :href='link'><slot></slot></a>",
  mounted: function () {
    if (getQS("from") == null) {
      this.link = this.href;
    }
  },
});

// 顶部导航header
Vue.component('du_header', {

  props: {
    href: { type: [String], default: "" },
    tit: { type: [String], default: "" }
  },

  data: function () {
    return {
      val: ""
    }
  },
  template: "<nav class='layout_head' >\
                  <bb class='left' :href='href'><i class='iconfont icon-nav_fanhui_baise'></i></bb>\
                  <h1>{{tit}}</h1>\
                  <div class='right'><slot></slot></div>\
                </nav>"
});