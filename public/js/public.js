var publicFunction;
(function () {
  publicFunction = {
    //跳转到菜谱列表页面
    toList: function (searchKey) {
      window.location.href = "/views/list?keyword=" + searchKey;
      // console.log(999, searchKey);
    },
    //根据菜谱ID跳转到详情页 
    toDetail: function (id) {
      //console.log("to_id:", id);
      window.location.href = "/views/detail?id=" + id;
    },
    //根据菜谱分类ID跳转到分页页面
    toClassify: function (id) {
      // console.log("to_id:", id);
      window.location.href = "/views/classify?id=" + id;
    },
    //获取url上的参数
    getQueryString: function (name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return decodeURI(r[2]); return null;
    },
    //改变URL参数值
    changeURLArg: function (url, arg, arg_val) {
      var pattern = arg + '=([^&]*)';
      var replaceText = arg + '=' + arg_val;
      if (url.match(pattern)) {
        var tmp = '/(' + arg + '=)([^&]*)/gi';
        tmp = url.replace(eval(tmp), replaceText);
        //return tmp;
        location.href = tmp;
      } else {
        if (url.match('[\?]')) {
          return url + '&' + replaceText;
        } else {
          return url + '?' + replaceText;
        }
      }
      return url + '\n' + arg + '\n' + arg_val;
    },
    //根据关键字搜索菜谱
    seachKeyFood: function (keyword) {
      var keyUrl = "/apis/search?appkey=''&keyword=" + keyword + "&num=20";
      console.log("keyUrl:", keyUrl);
      $.ajax({
        type: 'post',
        dataType: 'json',
        url: keyUrl,
        success: function (data) {
          if (data.result.msg === 'ok') {
            console.log("菜谱列表有数据返回:", data.result.result.num, data.result.result.list[0].name);
            //console.log("ajaxKeyList:", data);
            publicFunction.writeKeyList(data);
          } else {
            console.log("菜谱列表返回错误");
          }
        },
        error: function (data) {
          console.log(data);
        }
      });
    },
    //菜谱分类
    recipeClass: function () {
      var classUrl = "/apis/recipeClass?appkey=''";
      console.log("classUrl:", classUrl);
      $.ajax({
        type: 'post',
        dataType: 'json',
        url: classUrl,
        success: function (data) {
          if (data.result.msg === 'ok') {
            console.log("菜谱分类有数据返回:", data.result.result);
            //console.log("ajaxClassList:", data);
            publicFunction.writeNavList(data);
            //将菜谱分类的数据存进sessionStorage里以便分类页面中的tab标签页渲染数据
            var recipeClassData = JSON.stringify(data);
            //console.log("str_recipeClassData:", recipeClassData);
            sessionStorage.setItem("recipeClassData", recipeClassData);
          } else {
            console.log("菜谱分类返回错误");
          }
        },
        error: function (data) {
          console.log(data);
        }
      });
    },
    //渲染“分类”导航菜单的列表数据
    writeNavList: function (data) {
      var dataResult = data.result.result;
      $('header').find('.multi-column-dropdown').each(function (i, e) {
        var item = $(this);
        item.attr('id', "item" + i);
      });
      $.each(dataResult, function (index, val) {
        //console.log("dataResult:", dataResult, "parentId:", parentId);
        var dataList = data.result.result[index].list;
        $.each(dataList, function (i, v) {
          var parentId = v.parentid;
          var classId = v.classid;
          var navLiHtmls = '';
          navLiHtmls += '<li id="' + v.classid + '">' + v.name + '</li>';
          if (parentId == "223") {
            if (classId == "224" || classId == "225" || classId == "226" || classId == "227" || classId == "228" || classId == "229" || classId == "230" || classId == "231") {
              $("#item0").append(navLiHtmls);
            }
          };
          if (parentId == "561") {
            if (classId == "562" || classId == "563" || classId == "564" || classId == "565") {
              $("#item1").append(navLiHtmls);
            }
          };
        });
      });
      $('header').find('.multi-column-dropdown').find("li").each(function (index, element) {
        var itemLi = $(this);
        var classId = itemLi.attr('id');
        itemLi.on("click", function () {
          publicFunction.toClassify(classId);
        });
      });
    },
    //按分类ID检索
    searchByClassID: function () {
      //var byclassData;
      var idClassify = publicFunction.getQueryString("id");
      var classifyUrl = "/apis/searchByClass?appkey=''&classid=" + idClassify + "&start=0&num=10";
      console.log("classifyUrl:", idClassify, classifyUrl);
      $.ajax({
        type: 'post',
        dataType: 'json',
        url: classifyUrl,
        success: function (data) {
          console.log("classifyData:", data)
          if (data.result.msg === 'ok') {
            console.log("菜谱分类列表有数据返回:", data.result.result.num, data.result.result.list[0].name);
            //console.log("ajaxclassifyDataList:", data);
            publicFunction.writeClassifyList(data);
          } else {
            console.log("菜谱分类列表返回错误");
          }
        },
        error: function (data) {
          console.log(data);
        }
      });
    },
    //渲染分类页面Tab栏标签
    writeClassifyTab: function () {
      var recipeClassData = sessionStorage.getItem("recipeClassData");
      recipeClassData = JSON.parse(recipeClassData);
      //console.log("recipeClassData:", recipeClassData);
      var dataResult = recipeClassData.result.result;
      var urlClassId = publicFunction.getQueryString("id");
      //console.log("urlClassId-writeClassifyTab--:", urlClassId);
      var carouselUl_0 = $('#carousel_nav_0').find("ul");
      var carouselUl_1 = $('#carousel_nav_1').find("ul");

      //console.log("carousel_nav_dataList:", dataResult);
      var carouselNavHtmls = '';
      carouselNavHtmls += ' <li role="presentation">';
      carouselNavHtmls += '</li>';

      $.each(dataResult, function (index, val) {
        var dataList = dataResult[index].list;
        $.each(dataList, function (i, v) {
          var parentId = v.parentid;
          var classId = v.classid;
          if (parentId == "223") {
            if (classId == "224" || classId == "225" || classId == "226" || classId == "227" || classId == "228" || classId == "229" || classId == "230" || classId == "231") {
              if (urlClassId == "224" || urlClassId == "225" || urlClassId == "226" || urlClassId == "227" || urlClassId == "228" || urlClassId == "229" || urlClassId == "230" || urlClassId == "231") {
                carouselUl_0.append(carouselNavHtmls);
                carouselUl_0.find("li").eq(i).append('<a href="#carousel_content_' + v.classid + '" data-toggle="tab">' + v.name + '</a>');
              };
            };
          };
          if (parentId == "561") {
            if (classId == "562" || classId == "563" || classId == "564" || classId == "565") {
              if (urlClassId == "562" || urlClassId == "563" || urlClassId == "564" || urlClassId == "565") {
                carouselUl_1.append(carouselNavHtmls);
                carouselUl_1.find("li").eq(i).append('<a href="#carousel_content_' + v.classid + '" data-toggle="tab">' + v.name + '</a>');
              };

            };
          };
        });
      });
      $('.carousel_nav a').click(function (e) {
        e.preventDefault();
        var curTabIdStr = $(this).attr("href");
        // $(this).parent("li").addClass('active');
        // console.log("090:", $(this).parent("li"));
        var curTabId = curTabIdStr.substring(18);
        console.log("curTabIdStr:", curTabIdStr, "curTabId:", curTabId);
        var thisURL = location.href;
        publicFunction.changeURLArg(thisURL, "id", curTabId);
        publicFunction.searchByClassID(curTabId);
        //$(this).tab('show');
      });

    },
    //渲染根据分类ID响应回来的数据渲染
    writeClassifyList: function (data) {
      var dataResult = data.result.result.list;
      console.log("ClassifyListData0000", dataResult);
      var carouselContentHtmls = '';
      carouselContentHtmls += '<div class="row carousel_content">';
      carouselContentHtmls += '<div class="col-xs-12 col-md-6 carousel_l">';
      carouselContentHtmls += '<div id="classifyCarousel" class="carousel slide">';
      carouselContentHtmls += '<ol class="carousel-indicators carousel_num">';
      carouselContentHtmls += '</ol>';
      carouselContentHtmls += '<div class="carousel-inner carousel_inner">';
      carouselContentHtmls += '</div>';
      carouselContentHtmls += '<a class="left carousel-control" href="#classifyCarousel" role="button" data-slide="prev">';
      carouselContentHtmls += '<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>';
      carouselContentHtmls += '<span class="sr-only">Previous</span>';
      carouselContentHtmls += '</a>';
      carouselContentHtmls += '<a class="right carousel-control" href="#classifyCarousel" role="button" data-slide="next">';
      carouselContentHtmls += '<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>';
      carouselContentHtmls += '<span class="sr-only">Next</span>';
      carouselContentHtmls += '</a>';
      carouselContentHtmls += '</div>';
      carouselContentHtmls += '</div>';
      carouselContentHtmls += '<div class="col-xs-12 col-md-6 carousel_r">';
      //carouselContentHtmls += '<img src="../static/images/1.jpg" alt="..." class="img-thumbnail">';
      // carouselContentHtmls += '<ul class="list-group carousel_r_list"></ul>';
      carouselContentHtmls += '</div>';
      carouselContentHtmls += '</div>';
      var urlClassId = publicFunction.getQueryString("id");
      var carousel_tab_0 = $('#carousel_tab_0');
      var carousel_tab_1 = $('#carousel_tab_1');
      if (urlClassId == "224" || urlClassId == "225" || urlClassId == "226" || urlClassId == "227" || urlClassId == "228" || urlClassId == "229" || urlClassId == "230" || urlClassId == "231") {
        carousel_tab_0.append(carouselContentHtmls);
        carousel_tab_0.find(".carousel_content").attr("id", "carousel_content_" + urlClassId);
      };
      if (urlClassId == "562" || urlClassId == "563" || urlClassId == "564" || urlClassId == "565") {
        carousel_tab_1.append(carouselContentHtmls);
        carousel_tab_1.find(".carousel_content").attr("id", "carousel_content_" + urlClassId);
      };


      var carouselInnerHtmls = '';
      carouselInnerHtmls += '<div class="item">';
      carouselInnerHtmls += '<img src=" " alt=" ">';
      // carouselInnerHtmls += '<div class="carousel-caption"></div>';
      carouselInnerHtmls += '</div>';
      var carouselInnerRightHtmls = '';
      carouselInnerRightHtmls += '<ul class="list-group carousel_r_list">';
      carouselInnerRightHtmls += ' <li class="list-group-item">';
      carouselInnerRightHtmls += '<span class="badge">菜名</span>';
      carouselInnerRightHtmls += '<span class="carouselInner_name"></span>';
      carouselInnerRightHtmls += '</li>';
      carouselInnerRightHtmls += ' <li class="list-group-item">';
      carouselInnerRightHtmls += '<span class="badge">标签</span>';
      carouselInnerRightHtmls += '<span class="carouselInner_tag"></span>';
      carouselInnerRightHtmls += '</li>';
      carouselInnerRightHtmls += ' <li class="list-group-item">';
      carouselInnerRightHtmls += '<span class="badge">准备时间</span>';
      carouselInnerRightHtmls += '<span class="carouselInner_preparetime"></span>';
      carouselInnerRightHtmls += '</li>';
      carouselInnerRightHtmls += ' <li class="list-group-item">';
      carouselInnerRightHtmls += '<span class="badge">烹饪时间</span>';
      carouselInnerRightHtmls += '<span class="carouselInner_cookingtime"></span>';
      carouselInnerRightHtmls += '</li>';
      carouselInnerRightHtmls += '</ul>'

      var curCarouselInner = $("#carousel_content_" + urlClassId);
      // console.log("curCarouselInner:", curCarouselInner.length);
      $.each(dataResult, function (index, val) {
        console.log("val---:", val);
        if (val.classid == urlClassId) {
          var curInner = curCarouselInner.find('.carousel_inner');
          curInner.append(carouselInnerHtmls);
          var curItem = curInner.find('.item');
          curItem.eq(index).attr('id', val.id);
          curItem.eq(index).find('img').attr('src', val.pic);
          curItem.eq(index).find('img').attr('alt', val.name);
          curItem.eq(0).addClass('active');
          var carousel_r = curCarouselInner.find('.carousel_r');
          carousel_r.append(carouselInnerRightHtmls);
          var curRightItem = carousel_r.find('.carousel_r_list');
          curRightItem.eq(index).attr('id', 'curRightItem_' + val.id);
          curRightItem.eq(index).find('li').find('.carouselInner_name').text(val.name);
          curRightItem.eq(index).find('li').find('.carouselInner_tag').text(val.tag);
          curRightItem.eq(index).find('li').find('.carouselInner_preparetime').text(val.preparetime);
          curRightItem.eq(index).find('li').find('.carouselInner_cookingtime').text(val.cookingtime);
          curRightItem.eq(0).addClass('active');
        };
      });
      //轮播自动播放或切换轮播时右边的相关信息同时变化
      $('#classifyCarousel').on('slide.bs.carousel', function () {
        var activeCarousel = $(this).find(".item.active");
        var getCarouselId = activeCarousel.attr("id");
        var activeCarouselId = parseInt(getCarouselId) + parseInt(1);
        console.log("activeCarouselId:", activeCarouselId);
        var curRightList = $('.carousel_r_list');
        $(curRightList).each(function (c_i, c_e) {
          var curRightListIdStr = $(this).attr('id');
          var curRightListId = curRightListIdStr.substring(13);
          console.log("curRightListId:", curRightListIdStr, curRightListId);
          if (curRightListId == activeCarouselId) {
            console.log("isTRUE:", curRightListId == activeCarouselId);
            var activeCurRightItem = $('#curRightItem_' + activeCarouselId);
            activeCurRightItem.addClass('active');
            activeCurRightItem.siblings('.carousel_r_list').removeClass('active');
          }
        });
      });
      //点击轮播图片进入菜品详情页
      $('.carousel_inner').find('.item').each(function (c_i, c_e) {
        var foodId = $(this).attr("id");
        $(this).on('click', function () {
          publicFunction.toDetail(foodId);
        })
      });
      //tab标签页默认显示url上的类别
      $('[href="#carousel_content_' + urlClassId + '"]').parent("li").addClass('active');
      // console.log("okokok", $('[href="#carousel_content_' + urlClassId + '"]'))      

    },
    //渲染根据关键字响应回来的列表数据
    writeKeyList: function (data) {
      var dataResult = data.result.result.list;
      console.log("dataResult:", dataResult);
      console.log("item:", $(".food_list_content").find(".food_list_item").length);
      $(".food_list_content").find(".food_list_item").each(function (i, e) {
        var item = $(this);
        //console.log("item:", i, item);
        item.attr('id', "food_item" + i);
        //console.log("food_item1:", $("#food_item1"));
      });
      $.each(dataResult, function (index, val) {
        // console.log(index + ':data:' + val.pic);                
        $("#food_item" + index).find("img").attr("src", val.pic);
        $("#food_item" + index).find(".food_name").text(val.name);
        // $("#item0").find("img").attr("src", val.pic);
        // $("#item0").find(".food_name").text(val.name);
        // $("#item1").find("img").attr("src", val.pic);
        // $("#item1").find(".food_name").text(val.name);
        $("#food_item" + index).on("click", function () {
          publicFunction.toDetail(val.id);
        });
      });

    },


  }
})()




